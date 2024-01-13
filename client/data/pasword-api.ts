import { signJwt } from "@/lib/jwt";

//harusnya ini di lib
export const hashedPassword = async (
 password: string
): Promise<string | null> => {
 try {
  const access_token = signJwt(
   { password: password },
   "ACCESS_TOKEN_PRIVATE_KEY",
   {
    expiresIn: `2m`,
   }
  );

  const headers = new Headers({
   "Content-Type": "application/json",
   Authorization: `Bearer ${access_token}`,
  });
  const response = await fetch(
   "http://localhost:8000/auth/hash-password",
   {
    method: "GET",
    headers: headers,
   }
  );
  console.log(
   "🚀 ~ file: pasword-api.ts:26 ~ response:",
   response
  );

  if (response.ok) {
   const genertePasswordfromApi = await response.json();
   return genertePasswordfromApi.hash;
  } else {
   throw "error";
  }
 } catch {
  return null;
 }
};

export const comparePassword = async (
 email: string,
 password: string
): Promise<boolean> => {
 try {
  const access_token = signJwt(
   { email: email, password: password },
   "ACCESS_TOKEN_PRIVATE_KEY",
   {
    expiresIn: `2m`,
   }
  );

  const headers = new Headers({
   "Content-Type": "application/json",
   Authorization: `Bearer ${access_token}`,
  });
  const response = await fetch(
   "http://localhost:8000/auth/compare-hash",
   {
    method: "GET",
    headers: headers,
   }
  );

  if (response.ok) {
   return true;
  } else {
   throw "error";
  }
 } catch {
  return false;
 }
};
