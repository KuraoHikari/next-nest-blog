import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

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
   console.log("Token masuk1");
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
   console.log("Token masuk2");
   return session;
  },
  async jwt({ token }) {
   console.log("Token masuk3");
   if (!token.sub) return token;

   const existingUser = await getUserById(token.sub);
   console.log("Token masuk4");
   if (!existingUser) return token;

   const existingAccount = await getAccountByUserId(
    existingUser.id
   );

   const nestApiToken = "";

   token.nestApiToken = nestApiToken;

   token.isOAuth = !!existingAccount;
   token.name = existingUser.name;
   token.email = existingUser.email;
   token.role = existingUser.role;
   token.isTwoFactorEnabled =
    existingUser.isTwoFactorEnabled;

   return token;
  },
 },
 adapter: PrismaAdapter(db),
 session: { strategy: "jwt" },
 ...authConfig,
});
