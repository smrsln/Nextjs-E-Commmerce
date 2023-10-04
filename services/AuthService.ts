import { UserModel } from "@/models/User";
import { compare, hash } from "bcryptjs";
import { SignUpParams } from "@/types/index";
import { initSentry } from "@/lib/sentry";
import { OAuth2Client } from "google-auth-library";

export class AuthService {
  private googleClient?: OAuth2Client;
  private googleClientId?: string;

  constructor(googleClientId?: string) {
    initSentry();
    this.googleClientId = googleClientId;
    if (this.googleClientId) {
      this.googleClient = new OAuth2Client(this.googleClientId);
    }
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

  async signIn({ email, password }: { email: string; password: string }) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    return user;
  }

  async signInWithGoogle(idToken: string) {
    if (!this.googleClient) {
      throw new Error("Google authentication is not supported");
    }
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({
        email,
        role: "user",
      });
      await user.save();
    }
    return user;
  }
}
