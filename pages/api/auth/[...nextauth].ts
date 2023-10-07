import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Account, User, Profile } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import FacebookProvider, {
  FacebookProfile,
} from "next-auth/providers/facebook";
import { AuthService } from "@/services/AuthService";
import { AuthController } from "@/controllers/AuthController";
import { NextAuthUser } from "@/types/AuthTypes";

const authService = new AuthService();
const authController = new AuthController();

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
    async signIn(
      user: User,
      account: Account,
      profile: GoogleProfile | FacebookProfile
    ) {
      if (account?.provider === "google") {
        if (account.provider === "google") {
          return (
            profile.email_verified && profile.email.endsWith("@example.com")
          );
        }
        const nextAuthUser = await authController.googleSignIn(profile);
        return nextAuthUser ? { ...nextAuthUser, email: profile.email } : null;
      } else if (account?.provider === "facebook") {
        const nextAuthUser = await authController.facebookSignIn(profile);
        return nextAuthUser ? { ...nextAuthUser, email: profile.email } : null;
      } else if (user.email && user.password) {
        const session = await authController.signInWithPassword(
          user.email,
          user.password
        );
        return session.user as NextAuthUser;
      }
      return null;
    },
    async signUp(user: User, account: Account, profile: Profile) {
      const { email, password } = user;
      const session = await authController.signUpWithEmail(email, password);
      return session.user as NextAuthUser;
    },
    async session(session: any, user: NextAuthUser) {
      const dbUser = await authService.getUserById(user.id);
      if (dbUser) {
        session.user = dbUser;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
});
