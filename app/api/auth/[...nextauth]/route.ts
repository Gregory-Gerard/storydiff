import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getClient } from '@/lib/chromatic';
import { gql } from '@apollo/client';
import { z } from 'zod';

const authOptions: AuthOptions = {
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
    newUser: '/',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        let data;

        try {
          const response = await getClient().mutate({
            mutation: gql`
              mutation login($email: String!, $password: String!) {
                loginUser(email: $email, password: $password) {
                  id
                  name
                  email
                }
              }
            `,
            variables: credentials,
            fetchPolicy: 'network-only',
          });

          data = response.data;
        } catch (e) {
          return null;
        }

        const userValidation = z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().email(),
          chromaticToken: z.string(),
        });

        const parsedUser = userValidation.safeParse({
          ...data.loginUser,
          chromaticToken: data.authorization,
        });

        if (!parsedUser.success) {
          console.error(data, parsedUser.error);

          return null;
        }

        return parsedUser.data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.chromaticToken = user.chromaticToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (typeof token.chromaticToken === 'string') {
        session.chromaticToken = token.chromaticToken;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
