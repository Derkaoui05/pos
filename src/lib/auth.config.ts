import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Added in auth.ts with Credentials & bcrypt
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id!;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id   = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages:   { signIn: "/login" },
  session: { strategy: "jwt" },
  secret:  process.env.AUTH_SECRET!,
  trustHost: true,
} satisfies NextAuthConfig;

export const { auth } = NextAuth(authConfig);
