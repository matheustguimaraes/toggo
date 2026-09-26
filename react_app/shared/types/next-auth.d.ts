import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      username: string
      email: string
    } & DefaultSession['user']
    accessToken: string
  }

  interface User {
    id: number
    username: string
    email: string
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    user: {
      id: number
      username: string
      email: string
    }
  }
}
