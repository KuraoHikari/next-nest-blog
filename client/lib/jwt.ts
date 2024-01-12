import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
 payload: Object,
 keyName: "ACCESS_TOKEN_PRIVATE_KEY",
 options: SignOptions
) => {
 const key = process.env[String(keyName)];

 const privateKey = Buffer.from(
  String(key),
  "base64"
 ).toString("ascii");
 return jwt.sign(payload, privateKey, {
  ...(options && options),
  algorithm: "RS256",
 });
};

// export const verifyJwt = <T>(
//  token: string,
//  keyName: "ACCESS_TOKEN_PRIVATE_KEY"
// ): T | null => {
//  try {
//   const publicKey = Buffer.from(
//    config.get<string>(keyName),
//    "base64"
//   ).toString("ascii");

//   const decoded = jwt.verify(token, publicKey) as T;

//   return decoded;
//  } catch (error) {
//   return null;
//  }
// };
