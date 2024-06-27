import { apiClient } from "@/lib/api/apiClient";

import { classificationMonthlyAmountData } from "@/interface/classification-interface";

export const classificationMonthlyAmountGetData = async () => {
  try {
    const response = await apiClient.get("/classification_monthly_amounts");
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
    const response = await apiClient.post("/classification_monthly_amounts", {
      classification_monthlyamount: {
        classification_id: classification_id,
        month: month,
        date: date,
        amount: amount,
      },
    });
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
    const response = await apiClient.patch(
      `/classification_monthly_amounts/${id}`,
      {
        classification_monthlyamount: {
          classification_id: classification_id,
          month: month,
          date: date,
          amount: amount,
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
    await apiClient.delete(`/classification_monthly_amounts/${id}`);
  } catch (error) {
    throw new Error("Failed to delete classificationMonthlyAmount");
  }
};
