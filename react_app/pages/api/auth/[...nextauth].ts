
import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

import { IDjangoUser } from '../../../shared/types/user';

export const baseURL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000';

export const axiosChegadosApi = axios.create({ baseURL });

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/sign-out',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (!username || !password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          const authResponse = await axiosChegadosApi.post('/auth/token/', {
            username,
            password,
          });
          const accessToken = authResponse.data.access;

          const userResponse = await axiosChegadosApi.get(`/users/?username=${username}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const users: IDjangoUser[] = userResponse.data.results;
          
          if (!users || users.length === 0) {
            console.error('Nenhum usuário encontrado com o username:', username);
            console.error('Resposta completa:', userResponse.data);
            return null;
          }
          
          const firstUser: IDjangoUser = users[0];

          return {
            id: firstUser.id,
            username: firstUser.username,
            email: firstUser.email,
            accessToken: accessToken,
          };
        } catch (err: any) {
          console.error('Erro no authorize (capturado no frontend):', err.response?.data || err.message || err);
          console.error('Status do erro:', err.response?.status);
          console.error('Headers do erro:', err.response?.headers);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {

      if (user) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {

      session.user = {
        id: token.user?.id,
        name: token.user?.username,
        email: token.user?.email,
      };

      session.accessToken = token.accessToken;

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);