import axios from "axios";
import Cookies from "js-cookie";

import { paymentData } from "@/interface/payment-interface";

export const paymentGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/payments", {
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

export const paymentNew = async (
  category_id: string,
  classification_id: string,
  amount: number,
  schedule: Date,
  end_date: Date,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: [],
  body: string
): Promise<paymentData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/payments",
      {
        payment: {
          category_id: category_id,
          classification_id: classification_id,
          amount: amount,
          schedule: schedule,
          end_date: end_date,
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
    throw new Error("Failed to post payment");
  }
};

export const paymentEdit = async (
  id: string,
  category_id: string,
  classification_id: string,
  amount: number,
  schedule: Date,
  end_date: Date,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: [],
  body: string
) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/payments/${id}`,
      {
        payment: {
          category_id: category_id,
          classification_id: classification_id,
          amount: amount,
          schedule: schedule,
          end_date: end_date,
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
    throw new Error("Failed to edit payment");
  }
};

export const paymentDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/payments/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("delete成功");
  } catch (error) {
    throw new Error("Failed to delete payment");
  }
};
