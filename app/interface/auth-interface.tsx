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
