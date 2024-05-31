import axios from "axios";
import Cookies from "js-cookie";

import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";

export const repetitionMoneyGetData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/repetition_moneies",
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
    throw new Error("Failed to fetch data");
  }
};

export const repetitionMoneyNew = async (
  transaction_type: string,
  payment_id: string,
  income_id: string,
  transfer_id: string,
  amount: number,
  repetition_schedule: string
): Promise<repetitionMoneyData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/repetition_moneies",
      {
        repetition_money: {
          transaction_type: transaction_type,
          payment_id: payment_id,
          income_id: income_id,
          transfer_id: transfer_id,
          amount: amount,
          repetition_schedule: repetition_schedule,
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
    throw new Error("Failed to post repetitionMoney");
  }
};

export const repetitionMoneyEdit = async (
  id: string,
  transaction_type: string,
  payment_id: string,
  income_id: string,
  transfer_id: string,
  amount: number,
  repetition_schedule: string
): Promise<repetitionMoneyData> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/repetition_moneies/${id}`,
      {
        repetition_money: {
          transaction_type: transaction_type,
          payment_id: payment_id,
          income_id: income_id,
          transfer_id: transfer_id,
          amount: amount,
          repetition_schedule: repetition_schedule,
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
    throw new Error("Failed to edit repetitionMoney");
  }
};

export const repetitionMoneyDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/repetition_moneies/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
  } catch (error) {
    throw new Error("Failed to delete repetitionMoney");
  }
};
