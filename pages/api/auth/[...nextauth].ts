import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Account, User, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import FacebookProvider, {
  FacebookProfile,
} from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthController } from "@/controllers/AuthController";
import { UserModel } from "@/models/User";

const authController = new AuthController();

export default NextAuth({
  providers: [
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "text", placeholder: "jsmith" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const { email, password } = credentials;
    //     const user = await authController.signInWithPassword(email, password);
    //     return user ? { ...user, email } : null;
    //   },
    // }),
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
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        if (session.user) {
          const sessionUser = await UserModel.findOne({
            email: session.user.email,
          });
          session.user.id = sessionUser?._id.toString();
          session.user = { ...session.user, id: sessionUser?._id.toString() };
        }
        return session;
      } catch (error) {
        console.error(error);
        throw new Error("Error while creating session");
      }
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if ((profile as GoogleProfile)?.email_verified) {
          const user = await authController.googleSignIn(
            profile as GoogleProfile
          );
          return user ? { ...user, email: profile?.email } : null;
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
    async jwt({
      token,
      user,
      account,
      profile,
      isNewUser,
    }: {
      token: JWT;
      user: User;
      account: Account;
      profile: Profile;
      isNewUser: boolean;
    }): Promise<{
      token: JWT;
      user: User;
      account: Account;
      profile: Profile;
      isNewUser: boolean;
    }> {
      if (user) {
        token.id = user.id;
      }
      return { token, user, account, profile, isNewUser };
    },
    //I will make next-auth credential sign in work later

    // async signUp(user: User, account: Account, profile: Profile) {
    //   const { email, password } = user;
    //   const user = await authController.signInWithPassword(email, password);
    //   return user ? { ...user, email } : null;
    // },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    encode: async ({ token, secret }) => {
      const encodedToken = await authController.encodeToken(token, secret);
      return encodedToken;
    },
    decode: async ({ token, secret }) => {
      const decodedToken = await authController.decodeToken(token, secret);
      return decodedToken;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    //signOut: "/auth/signout",
    //error: "/auth/error",
  },
});
