import { registerAs } from '@nestjs/config';

export const policiesConfig = registerAs(
  'policies',
  (): {
    url?: string;
    autoRevocation: {
      policy?: `${string}/${string}/${string}/${string}`;
    };
    autoReissue: {
      policy?: `${string}/${string}/${string}/${string}`;
    };
    refresh: {
      policy?: `${string}/${string}/${string}/${string}`;
    };
  } => ({
    url: process.env.POLICIES_URL,
    autoRevocation: {
      policy:
        (process.env.POLICIES_AUTO_REVOCATION_POLICY as
          | `${string}/${string}/${string}/${string}`
          | undefined) || undefined,
    },
    autoReissue: {
      policy:
        (process.env.POLICIES_AUTO_REISSUE_POLICY as
          | `${string}/${string}/${string}/${string}`
          | undefined) || undefined,
    },
    refresh: {
      policy:
        (process.env.POLICIES_REFRESH_POLICY as
          | `${string}/${string}/${string}/${string}`
          | undefined) || undefined,
    },
  }),
);
