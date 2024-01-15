import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";
import { generateNestApiToken } from "./lib/token";

export const {
 handlers: { GET, POST },
 auth,
 signIn,
 signOut,
 update,
} = NextAuth({
 pages: {
  signIn: "/auth/login",
  error: "/auth/error",
 },
 events: {
  async linkAccount({ user }) {
   await db.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
   });
  },
 },

 callbacks: {
  async signIn({ user, account }) {
   if (account?.provider !== "credentials") return true;

   const existingUser = await getUserById(user.id);

   if (!existingUser?.emailVerified) return false;

   if (existingUser.isTwoFactorEnabled) {
    const twoFactorConfirmation =
     await getTwoFactorConfirmationByUserId(
      existingUser.id
     );

    if (!twoFactorConfirmation) return false;

    await db.twoFactorConfirmation.delete({
     where: { id: twoFactorConfirmation.id },
    });
   }

   return true;
  },
  async session({ token, session }) {
   if (token.sub && session.user) {
    session.user.id = token.sub;
   }

   if (token.role && session.user) {
    session.user.role = token.role as UserRole;
   }

   if (session.user) {
    session.user.isTwoFactorEnabled =
     token.isTwoFactorEnabled as boolean;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.isOAuth = token.isOAuth as boolean;
   }

   if (token.nestApiToken) {
    session.nestApiToken = token.nestApiToken as string;
    session.nestApiExpires = token.nestApiExpires as number;
   }

   console.log(
    "🚀 ~ session ~ session.nestApiToken:",
    session.nestApiToken
   );

   return session;
  },
  async jwt({ token }) {
   if (!token.sub) return token;

   const existingUser = await getUserById(token.sub);
   if (!existingUser) return token;

   const existingAccount = await getAccountByUserId(
    existingUser.id
   );

   token.isOAuth = !!existingAccount;
   token.name = existingUser.name;
   token.email = existingUser.email;
   token.role = existingUser.role;
   token.isTwoFactorEnabled =
    existingUser.isTwoFactorEnabled;

   if (!token.nestApiToken) {
    const nestApiToken = await generateNestApiToken(
     token.sub
    );

    token.nestApiToken = nestApiToken.access_token;
    token.nestApiExpires = nestApiToken.expires;
   }

   if (Date.now() < Number(token.nestApiExpires)) {
    return token;
   }

   const nestApiToken = await generateNestApiToken(
    token.sub
   );

   return {
    ...token,
    nestApiToken: nestApiToken.access_token,
    nestApiExpires: nestApiToken.expires,
   };
  },
 },
 adapter: PrismaAdapter(db),
 session: { strategy: "jwt" },
 ...authConfig,
});
