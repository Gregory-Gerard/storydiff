import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    chromaticToken?: string | undefined;
  }

  interface User extends DefaultUser {
    chromaticToken?: string | undefined;
  }
}
