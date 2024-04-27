import axios from "axios";
import Cookies from "js-cookie";

import { purposeDate } from "@/interface/purpose-interface";

export const purposeGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/purposes", {
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

export const purposeNew = async (
  title: string,
  result: string,
  deadline: Date,
  body: string
): Promise<purposeDate> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/purposes",
      {
        purpose: {
          title: title,
          result: result,
          deadline: deadline,
          body: body,
          completed: false,
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
    throw new Error("Failed to post purpose");
  }
};
export const purposeEdit = async (
  id: string,
  title: string,
  result: string,
  deadline: Date,
  body: string,
  completed: boolean
) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/purposes/${id}`,
      {
        purpose: {
          title: title,
          result: result,
          deadline: deadline,
          body: body,
          completed: completed,
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
    return response;
  } catch (error) {
    throw new Error("Failed to edit purpose");
  }
};

export const purposeDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/purposes/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("delete成功");
  } catch (error) {
    throw new Error("Failed to delete purpose");
  }
};
