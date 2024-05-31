import axios from "axios";
import Cookies from "js-cookie";

import { accountData } from "@/interface/account-interface";

export const accountGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/accounts", {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const accountNew = async (
  name: string,
  amount: number,
  body: string
): Promise<accountData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/accounts",
      {
        account: {
          name: name,
          amount: amount,
          body: body,
        },
      },
      {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to post account");
  }
};

export const accountEdit = async (
  id: string,
  name: string,
  amount: number,
  body: string
): Promise<accountData> => {
  if (!name) {
    console.error("Name field is empty. Request not sent.");
    throw new Error("Name field cannot be empty.");
  }
  try {
    const response = await axios.patch(
      `http://localhost:3000/accounts/${id}`,
      {
        account: {
          name: name,
          amount: amount,
          body: body,
        },
      },
      {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit account");
  }
};

export const accountDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/accounts/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
  } catch (error) {
    throw new Error("Failed to delete account");
  }
};
