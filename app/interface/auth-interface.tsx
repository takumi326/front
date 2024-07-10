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
  email: string;
  password: string;
}

// ユーザー情報変更
export interface ResetParams {
  email: string;
  redirect_url: string;
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
