import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID!,
    //   clientSecret: process.env.GOOGLE_SECRET!,
    // }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },
      },

      async authorize(credentials, req) {
        const user = await fetch(`${process.env.SERVER_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }).then((res) => res.json());

        if (!user.valid) {
          throw new Error(user.title);
        }

        return user.response;
      },
    }),
  ],
  callbacks: {
    jwt({
      token,
      session,
      trigger,
      user,
    }: {
      token: any;
      user: any;
      session?: any;
      trigger?: any;
    }) {
      if (user) token.user = user;

      // if (trigger === 'update') {
      //   return { ...token, user: session.user };
      // }

      return token;
    },

    session({ session, token, trigger }: { session: any; token: any; trigger?: any }) {
      session.user = token.user;

      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
});

export { handler as GET, handler as POST };
