export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}
export interface GoogleProfile {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface FacebookProfile {
  id: string;
  email: string;
  name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

export type NextAuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
};
