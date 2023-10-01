import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { AuthService } from "@/services/AuthService";
import { SignUpParams } from "@/types/index";
import { User, Account, Profile } from "next-auth";

export class AuthController {
  async googleSignIn(user: User, account: Account | null, profile?: Profile) {
    const authService = new AuthService();
    const email = profile?.email as string;
    const password = account?.provider + "_" + account?.id;
    await authService.signIn({ email, password });
    return true;
  }

  async facebookSignIn(
    user: User,
    account: Account | null,
    profile?: Profile
  ): Promise<boolean> {
    const authService = new AuthService();
    const email = profile?.email as string;
    const password = account?.provider + "_" + account?.id;
    await authService.signIn({ email, password });
    return true;
  }

  async signIn(req: NextApiRequest, res: NextApiResponse) {
    const { email, password }: SignUpParams = req.body;
    const authService = new AuthService();
    const user = await authService.signIn({ email, password });
    res.status(200).json(user);
  }

  async signUp(req: NextApiRequest, res: NextApiResponse) {
    const { email, password }: SignUpParams = req.body;
    const authService = new AuthService();
    const user = await authService.signUp({ email, password });
    res.status(201).json(user);
  }

  async signOut(req: NextApiRequest, res: NextApiResponse) {
    const authService = new AuthService();
    const session = await getSession({ req });
    if (session) {
      await authService.signOut(session);
      res.status(200).end();
    } else {
      res.status(401).end();
    }
  }
}
