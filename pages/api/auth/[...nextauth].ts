// [...nextauth].ts

import NextAuth, { User, Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { AuthController } from "@/controllers/AuthController";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn(params: {
      user: User;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }): Promise<boolean> {
      const authController = new AuthController();
      if (params.account?.provider === "google") {
        await authController.googleSignIn(
          params.user as User,
          params.account as Account,
          params.profile as Profile
        );
      } else if (params.account?.provider === "facebook") {
        await authController.facebookSignIn(
          params.user as User,
          params.account as Account,
          params.profile as Profile
        );
      }
      return true;
    },
  },
});
