import { useSearchParams } from "next/navigation";
import { authClient, resetClient } from "@/lib/api/authClient";
import Cookies from "js-cookie";

import {
  signUpParams,
  signInParams,
  UpdateParams,
  ResetPasswordParams,
  ResetParams,
} from "@/interface/auth-interface";

export const signUp = (params: signUpParams) => {
  return authClient.post("auth", params);
};

export const signIn = (params: signInParams) => {
  return authClient.post("auth/sign_in", params);
};

export const signOut = () => {
  return authClient.delete("auth/sign_out", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const UpdateUser = (params: UpdateParams) => {
  const { email, accessToken, client, uid } = params;

  return resetClient.patch(
    "auth",
    {
      email: email,
    },
    {
      headers: {
        "access-token": accessToken,
        client: client,
        uid: uid,
      },
    }
  );
};

export const ResetPassword = (params: ResetPasswordParams) => {
  return authClient.post("auth/password", params);
};

export const Reset = (params: ResetParams) => {
  const { password, passwordConfirmation, accessToken, client, uid } = params;

  return resetClient.patch(
    "auth/password",
    {
      password: password,
      password_confirmation: passwordConfirmation,
    },
    {
      headers: {
        "access-token": accessToken,
        client: client,
        uid: uid,
      },
    }
  );
};

export const getCurrentUser = () => {
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return;
  return authClient.get("/auth/sessions", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
