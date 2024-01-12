"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { hashedPassword } from "@/data/pasword-api";

export const register = async (
 values: z.infer<typeof RegisterSchema>
) => {
 const validatedFields = RegisterSchema.safeParse(values);

 if (!validatedFields.success) {
  return { error: "Invalid fields!" };
 }

 const { email, password, name } = validatedFields.data;

 const hash = await hashedPassword(password);

 if (!hash) {
  return { error: "Invalid Credentials" };
 }

 const existingUser = await getUserByEmail(email);

 if (existingUser) {
  return { error: "Invalid Credentials" };
 }

 await db.user.create({
  data: {
   name,
   email,
   password: hash,
  },
 });

 const verificationToken = await generateVerificationToken(
  email
 );

 await sendVerificationEmail(
  verificationToken.email,
  verificationToken.token
 );

 return { success: "User Created!" };
};
