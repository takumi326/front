import { apiClient } from "@/lib/api/apiClient";

import { incomeData } from "@/interface/income-interface";

export const incomeGetData = async () => {
  try {
    const response = await apiClient.get("/incomes");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const incomeNew = async (
  category_id: string,
  classification_id: string,
  amount: number,
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
  body: string
): Promise<incomeData> => {
  try {
    const response = await apiClient.post("/incomes", {
      income: {
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
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to post income");
  }
};

export const incomeEdit = async (
  id: string,
  category_id: string,
  classification_id: string,
  amount: number,
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
  body: string
): Promise<incomeData> => {
  try {
    const response = await apiClient.patch(`/incomes/${id}`, {
      income: {
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
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit income");
  }
};

export const incomeDelete = async (id: string) => {
  try {
    await apiClient.delete(`/incomes/${id}`);
  } catch (error) {
    throw new Error("Failed to delete income");
  }
};
