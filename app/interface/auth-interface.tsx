// サインアップ
export interface signUpParams {
  email: string;
  password: string;
  passwordConfirmation: string;
}

// サインイン
export interface signInParams {
  email: string;
  password: string;
}

// ユーザー情報変更
export interface UpdateParams {
  email: string | undefined;
  accessToken: string | undefined;
  client: string | undefined;
  uid: string | undefined;
}

// ユーザー情報変更
export interface ResetPasswordParams {
  email: string;
  redirect_url: string;
}

export interface ResetParams {
  password: string;
  passwordConfirmation: string;
  accessToken: string | null;
  client: string | null;
  uid: string | null;
}

// ユーザー
export interface User {
  id: number;
  uid: string;
  provider: string;
  email: string;
  name: string;
  nickname?: string;
  image?: string;
  allowPasswordChange: boolean;
  created_at: Date;
  updated_at: Date;
}
