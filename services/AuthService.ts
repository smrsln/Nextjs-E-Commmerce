import { UserModel } from "@/models/User";
import { connectToMongoDB } from "@/lib/db";
import { compare, hash } from "bcrypt";
import { SignUpParams } from "@/types/index";
import { getSession } from "next-auth/react";
import { initSentry } from "@/lib/sentry";

export class AuthService {
  constructor() {
    initSentry();
  }

  async signUp({ email, password }: SignUpParams) {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
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

  async signIn({ email, password }: SignUpParams) {
    const db = await connectToMongoDB();
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
      await db.collection("sessions").insertOne({
        userId: user._id,
        expires: session.expires,
      });
    }
  }

  async signOut(session: any) {
    const db = await connectToMongoDB();
    await db.collection("sessions").deleteOne({ _id: session.id });
  }
}
