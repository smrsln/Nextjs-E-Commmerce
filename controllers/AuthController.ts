import { NextApiRequest, NextApiResponse } from "next";
import { AuthService } from "@/services/AuthService";
import { SignUpParams } from "@/types/AuthTypes";
import { User, Account, Profile } from "next-auth";
import { UserDocument } from "@/models/User";
import { FacebookProfile } from "next-auth/providers/facebook";
import { GoogleProfile } from "next-auth/providers/google";
import jwt, { Jwt, Secret } from "jsonwebtoken";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async googleSignIn(profile: GoogleProfile): Promise<User | undefined> {
    const user = await this.authService.signInWithGoogle(profile);
    return user;
  }

  async facebookSignIn(profile: FacebookProfile): Promise<User | undefined> {
    const user = await this.authService.signInWithFacebook(profile);
    return user;
  }

  async signInWithPassword(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    const session = await this.authService.signInWithPassword({
      email,
      password,
    });
    res.status(200).json({ session });
  }

  async signUp(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body as SignUpParams;
    const session = await this.authService.signUp({ email, password });
    res.status(200).json({ session });
  }

  async signOut(req: NextApiRequest, res: NextApiResponse) {
    await this.authService.signOut(req, res);
  }

  //Will be moving into AuthService START
  async encodeToken(token: Jwt, secret: Secret): Promise<string> {
    const encodedToken = jwt.sign(token, secret);
    return encodedToken;
  }

  async decodeToken(token: string, secret: string): Promise<any> {
    const decodedToken = jwt.verify(token, secret);
    return decodedToken;
  }
  // will be moving into AuthService END
}
