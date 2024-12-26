import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import api from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "User Credentials Login",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await api
          .post(`/auth/admin-signin`, {
            username: credentials?.identifier,
            password: credentials?.password,
          })
          .then(({ data }) => {
            const mergeData = {
              ...data?.data,
              jwt: data?.data.token,
            };

            return mergeData;
          })
          .catch((e) => {
            console.log(e);

            return null;
          });

        // If no error and we have user data, return it
        return user;
      },
    }),
    CredentialsProvider({
      id: "domain-credentials",
      name: "User Credentials Login",
      credentials: {
        username: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
        domain: { label: "Domain", type: "text" },
      },
      async authorize(credentials) {
        const user = await api
          .post(`/auth/domain-signin`, {
            username: credentials?.username,
            password: credentials?.password,
            domain: credentials?.domain,
          })
          .then(({ data }) => {
            const mergeData = {
              ...data?.data,
              jwt: data?.data.token,
            };

            return mergeData;
          })
          .catch((e) => {
            console.log(e);

            return null;
          });

        // If no error and we have user data, return it
        return user;
      },
    }),
    CredentialsProvider({
      id: "subdomain-credentials",
      name: "User Credentials Login",
      credentials: {
        username: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
        subdomain: { label: "Subdomain", type: "text" },
      },
      async authorize(credentials) {
        const user = await api
          .post(`/auth/subdomain-signin`, {
            username: credentials?.username,
            password: credentials?.password,
            domain: credentials?.subdomain,
          })
          .then(({ data }) => {
            const mergeData = {
              ...data?.data,
              jwt: data?.data.token,
            };

            return mergeData;
          })
          .catch((e) => {
            console.log(e);

            return null;
          });

        // If no error and we have user data, return it
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "1234567890",

  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
    updateAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/",
    signOut: "/",
  },

  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (user) {
        token.user = user.user;
        token.jwt = user.jwt;
        token.user.verify = token.user.isTwoFactorEnabled ? false : true;
      }

      if (trigger === "update") {
        token.user.verify = session.verify;
      }

      return token;
    },

    async session({ session, token }) {
      // Make the access token available in the session object
      session.user = token.user;
      session.jwt = token.jwt;

      return session;
    },
  },

  theme: {
    colorScheme: "light",
  },

  debug: false,
};
