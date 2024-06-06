import axios from "axios";
import Cookies from "js-cookie";

import { classificationMonthlyAmountData } from "@/interface/classification-interface";

export const classificationMonthlyAmountGetData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/classification_monthly_amounts",
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

export const classificationMonthlyAmountNew = async (
  classification_id: string,
  month: string,
  date: string,
  amount: number
): Promise<classificationMonthlyAmountData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/classification_monthly_amounts",
      {
        classification_monthlyamount: {
          classification_id: classification_id,
          month: month,
          date: date,
          amount: amount,
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
    throw new Error("Failed to post classificationMonthlyAmount");
  }
};

export const classificationMonthlyAmountEdit = async (
  id: string,
  classification_id: string,
  month: string,
  date: string,
  amount: number
): Promise<classificationMonthlyAmountData> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/classification_monthly_amounts/${id}`,
      {
        classification_monthlyamount: {
          classification_id: classification_id,
          month: month,
          date: date,
          amount: amount,
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
    throw new Error("Failed to edit classificationMonthlyAmount");
  }
};

export const classificationMonthlyAmountDelete = async (id: string) => {
  try {
    await axios.delete(
      `http://localhost:3000/classification_monthly_amounts/${id}`,
      {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      }
    );
  } catch (error) {
    throw new Error("Failed to delete classificationMonthlyAmount");
  }
};
