import axios from "axios";
import Cookies from "js-cookie";

import { purposeData } from "@/interface/purpose-interface";

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
    throw new Error("Failed to fetch purpose");
  }
};

export const purposeNew = async (
  title: string,
  result: string,
  deadline: string,
  body: string
): Promise<purposeData> => {
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
    return response.data;
  } catch (error) {
    throw new Error("Failed to post purpose");
  }
};

export const purposeEdit = async (
  id: string,
  title: string,
  result: string,
  deadline: string,
  body: string,
  completed: boolean
): Promise<purposeData> => {
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
    return response.data;
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
  } catch (error) {
    throw new Error("Failed to delete purpose");
  }
};
