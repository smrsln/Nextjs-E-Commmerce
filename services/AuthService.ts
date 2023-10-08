import { NextApiRequest, NextApiResponse } from "next";
import { compare, hash } from "bcryptjs";
import { getSession } from "next-auth/react";
import { UserDocument, UserModel } from "@/models/User";
import type { GoogleProfile } from "next-auth/providers/google";
import type { Profile, Session, User } from "next-auth";
import { FacebookProfile } from "next-auth/providers/facebook";

export class AuthService {
  async signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UserDocument> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    if (await UserModel.exists({ email })) {
      throw new Error("Email already exists");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    const hashedPassword = await hash(password, 12);
    const user = new UserModel({
      email,
      password: hashedPassword,
      role: "user",
    });
    await user.save();
    return user;
  }

  async signInWithPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | undefined> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const session = await getSession();
    if (session) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    } else {
      throw new Error("Session not found");
    }
  }

  async signInWithGoogle(profile: GoogleProfile): Promise<User | undefined> {
    const email = profile.email as string;
    const user = await UserModel.findOne({ email });
    if (!user) {
      const newUser = new UserModel({
        email,
        name: profile.given_name as string,
        image: profile.picture as string,
        role: "user",
        googleId: profile.sub as string,
      });
      await newUser.save();
      return {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
      };
    } else if (!user.googleId) {
      user.googleId = profile.sub as string;
      user.name = profile.given_name as string;
      user.image = profile.picture as string;
      await user.save();
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      };
    }
  }

  async signInWithFacebook(
    profile: FacebookProfile
  ): Promise<User | undefined> {
    const email = profile.email as string;
    const user = await UserModel.findOne({ email });
    if (!user) {
      const newUser = new UserModel({
        email,
        name: profile.name as string,
        image: `https://graph.facebook.com/${profile.sub}/picture?type=large`,
        role: "user",
        facebookId: profile.sub as string,
      });
      await newUser.save();
      return {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
      };
    } else if (!user.facebookId) {
      user.facebookId = profile.sub as string;
      user.name = profile.name as string;
      user.image = `https://graph.facebook.com/${profile.sub}/picture?type=large`;
      await user.save();
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      };
    }
  }

  async signOut(req: NextApiRequest, res: NextApiResponse) {
    await (req as any).session.destroy();
    res.status(200).end();
  }
}
