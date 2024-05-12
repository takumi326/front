import axios from "axios";
import Cookies from "js-cookie";

import { transferData } from "@/interface/transfer-interface";

export const transferGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/transfers", {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("get成功");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const transferNew = async (
  before_account_id: string,
  after_account_id: string,
  amount: number,
  schedule: Date,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: [],
  body: string
): Promise<transferData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/transfers",
      {
        transfer: {
          before_account_id: before_account_id,
          after_account_id: after_account_id,
          amount: amount,
          schedule: schedule,
          repetition: repetition,
          repetition_type: repetition_type,
          repetition_settings: repetition_settings,
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
    console.log("new成功");
    // レスポンスから作成された目的の情報を抽出して返す
    return response.data;
  } catch (error) {
    throw new Error("Failed to post transfer");
  }
};

export const transferEdit = async (
  id: string,
  before_account_id: string,
  after_account_id: string,
  amount: number,
  schedule: Date,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: [],
  body: string
) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/transfers/${id}`,
      {
        transfer: {
          before_account_id: before_account_id,
          after_account_id: after_account_id,
          amount: amount,
          schedule: schedule,
          repetition: repetition,
          repetition_type: repetition_type,
          repetition_settings: repetition_settings,
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
    console.log("update成功");
    console.log(response);
    return response;
  } catch (error) {
    throw new Error("Failed to edit transfer");
  }
};

export const transferDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/transfers/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("delete成功");
  } catch (error) {
    throw new Error("Failed to delete transfer");
  }
};
