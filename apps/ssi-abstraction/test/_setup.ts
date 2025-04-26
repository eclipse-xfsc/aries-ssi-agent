import { randomBytes } from 'node:crypto';
import { Wait, GenericContainer, Network } from 'testcontainers';

export default async function setup() {
  const natsCredentials = {
    user: 'nats_' + randomBytes(8).toString('hex'),
    password: randomBytes(16).toString('hex'),
  };

  const s3Credentials = {
    secretKey: randomBytes(16).toString('hex'),
    accessKey: randomBytes(16).toString('hex'),
  };

  const network = await new Network().start();

  const [nats, minio] = await Promise.all([
    new GenericContainer('nats')
      .withNetwork(network)
      .withExposedPorts(4222, 8222)
      .withCommand([
        '--config',
        'nats-server.conf',
        '--debug',
        '--trace',
        '--user',
        natsCredentials.user,
        '--pass',
        natsCredentials.password,
      ])
      .withWaitStrategy(Wait.forLogMessage('Server is ready'))
      .start(),

    new GenericContainer('minio/minio')
      .withNetwork(network)
      .withExposedPorts(9000, 9001)
      .withEnvironment({
        MINIO_ROOT_USER: 'minio',
        MINIO_ROOT_PASSWORD: 'minio123',
      })
      .withCommand(['server', '/data', '--console-address', ':9001'])
      .withWaitStrategy(
        Wait.forLogMessage('Status:         1 Online, 0 Offline.'),
      )
      .start(),
  ]);

  const s3URL = new URL('http://' + minio.getIpAddress(network.getName()));
  s3URL.port = '9000';

  const initS3 = await new GenericContainer('minio/mc')
    .withNetwork(network)
    .withEntrypoint(['/bin/sh', '-c'])
    .withCommand([
      `
      /usr/bin/mc config host add ssi-s3 ${s3URL.toString()} minio minio123;
      /usr/bin/mc mb --ignore-existing ssi-s3/ssi;
      /usr/bin/mc anonymous set download ssi-s3/ssi;
      /usr/bin/mc admin user add ssi-s3 ${s3Credentials.accessKey} ${s3Credentials.secretKey};
      /usr/bin/mc admin policy attach ssi-s3 readwrite --user=${s3Credentials.accessKey};
      exit 0;
      `,
    ])
    .start();

  const natsURL = new URL('nats://' + nats.getHost());
  natsURL.port = nats.getMappedPort(4222).toString();

  const natsMonitoringURL = new URL('http://' + nats.getHost());
  natsMonitoringURL.port = nats.getMappedPort(8222).toString();

  process.env.NATS_URL = natsURL.toString();
  process.env.NATS_USER = natsCredentials.user;
  process.env.NATS_PASSWORD = natsCredentials.password;
  process.env.NATS_MONITORING_URL = natsMonitoringURL.toString();

  const tailsServerURL = new URL('http://' + minio.getHost());
  tailsServerURL.port = minio.getMappedPort(9000).toString();

  process.env.TAILS_SERVER_BASE_URL = tailsServerURL.toString();
  process.env.TAILS_SERVER_BUCKET_NAME = 'ssi';
  process.env.S3_ACCESS_KEY = s3Credentials.accessKey;
  process.env.S3_SECRET = s3Credentials.secretKey;

  Reflect.defineProperty(global, '__TESTCONTAINERS__', [nats, minio, initS3]);
}
