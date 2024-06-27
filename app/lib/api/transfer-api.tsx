import { apiClient } from "@/lib/api/apiClient";

import { transferData } from "@/interface/transfer-interface";

export const transferGetData = async () => {
  try {
    const response = await apiClient.get("/transfers");
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
    const response = await apiClient.post("/transfers", {
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
    });
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
    const response = await apiClient.patch(`/transfers/${id}`, {
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
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit transfer");
  }
};

export const transferDelete = async (id: string) => {
  try {
    await apiClient.delete(`/transfers/${id}`);
  } catch (error) {
    throw new Error("Failed to delete transfer");
  }
};
