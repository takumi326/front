import axios from "axios";
import Cookies from "js-cookie";

import { classificationData } from "@/interface/classification-interface";

export const classificationGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/classifications", {
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

export const classificationNew = async (
  account_id: string,
  name: string,
  classification_type: string
): Promise<classificationData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/classifications",
      {
        classification: {
          account_id: account_id,
          name: name,
          classification_type: classification_type,
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
    throw new Error("Failed to post classification");
  }
};

export const classificationEdit = async (
  id: string,
  account_id: string,
  name: string,
  classification_type: string
): Promise<classificationData> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/classifications/${id}`,
      {
        classification: {
          account_id: account_id,
          name: name,
          classification_type: classification_type,
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
    throw new Error("Failed to edit classification");
  }
};

export const classificationDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/classifications/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
  } catch (error) {
    throw new Error("Failed to delete classification");
  }
};
