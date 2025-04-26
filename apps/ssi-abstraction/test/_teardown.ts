import type { StartedTestContainer } from 'testcontainers';

export default async function teardown() {
  const globalTestcontainers: StartedTestContainer[] = Reflect.get(
    global,
    '__TESTCONTAINERS__',
  );

  if (!globalTestcontainers) {
    return;
  }

  await Promise.all(globalTestcontainers.map((container) => container.stop()));
}
