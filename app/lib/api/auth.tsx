import { client } from "@/lib/api/client";
import Cookies from "js-cookie";

import {
  signUpParams,
  signInParams,
  UpdateParams,
  ResetParams,
} from "@/interface/auth-interface";

export const signUp = (params: signUpParams) => {
  return client.post("auth", params);
};

export const signIn = (params: signInParams) => {
  return client.post("auth/sign_in", params);
};

export const signOut = () => {
  return client.delete("auth/sign_out", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

export const UpdateUser = (params: UpdateParams) => {
  return client.put("auth", params);
};

export const ResetPassword = (params: ResetParams) => {
  return client.post("auth/password", params);
};

export const getCurrentUser = () => {
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return;
  return client.get("/auth/sessions", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
