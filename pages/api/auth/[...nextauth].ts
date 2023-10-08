import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Account, User, Profile } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import FacebookProvider, {
  FacebookProfile,
} from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthController } from "@/controllers/AuthController";

const authController = new AuthController();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await authController.signInWithPassword(email, password);
        return user ? { ...user, email } : null;
      },
    }),
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
    async signIn(params) {
      const { user, account, profile } = params;
      if (account?.provider === "google") {
        if ((profile as GoogleProfile)?.email_verified) {
          const UserDocument = await authController.googleSignIn(
            profile as GoogleProfile
          );
          return UserDocument
            ? { ...UserDocument, email: profile?.email }
            : null;
        }
      } else if (account?.provider === "facebook") {
        if ((profile as FacebookProfile)?.verified) {
          const UserDocument = await authController.facebookSignIn(
            profile as FacebookProfile
          );
          return UserDocument
            ? { ...UserDocument, email: profile?.email }
            : null;
        }
      } else if (user.email && "password" in user) {
        const req = {
          body: {
            email: user.email,
            password: user.password,
          },
        } as NextApiRequest;
        return user ? { ...user, email: user.email } : null;
      }
      return null;
    },
    async signUp(user: User, account: Account, profile: Profile) {
      const { email, password } = user;
      const user = await authController.signInWithPassword(email, password);
      return user ? { ...user, email } : null;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
});
