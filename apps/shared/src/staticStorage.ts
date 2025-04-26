import axios, { AxiosHeaders } from 'axios';

export type UploadToS3Options = {
  s3Url: string;
  bucketName: string;
  fileId: string;
  content: Uint8Array;
  accessKey: string;
  secret: string;
};

const generateRfc1123Date = () =>
  new Date()
    .toLocaleString('en-GB', {
      timeZone: 'UTC',
      hour12: false,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/(?:(\d),)/, '$1') + ' GMT';

// Upload to S3 and return the URL to fetch it from
export const uploadToS3 = async ({
  s3Url,
  content,
  fileId,
  bucketName,
  accessKey,
  secret,
}: UploadToS3Options) => {
  // TODO: double check all headers
  const headers = new AxiosHeaders()
    .set('Host', s3Url)
    .set('Date', generateRfc1123Date())
    .set('Content-Type', 'application/octet-stream')
    .set('Authorization', accessKey)
    .set('Secret', secret);

  const sanitizedUrl = s3Url.endsWith('/')
    ? s3Url.slice(0, s3Url.length - 1)
    : s3Url;

  const url = `${sanitizedUrl}/${bucketName}/${fileId}`;

  // TODO: check whether we need to include the sig or not
  const result = await axios.put(url, content, {
    headers,
  });

  if (result.status > 299) {
    throw new Error(`Error uploading to S3. Error: ${JSON.stringify(result)}`);
  }

  return url;
};
