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
    // console.log(response);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const transferNew = async (
  before_account_id: string,
  after_account_id: string,
  amount: number,
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
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
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
  body: string
): Promise<transferData> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/transfers/${id}`,
      {
        transfer: {
          before_account_id: before_account_id,
          after_account_id: after_account_id,
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
    return response.data;
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
  } catch (error) {
    throw new Error("Failed to delete transfer");
  }
};
