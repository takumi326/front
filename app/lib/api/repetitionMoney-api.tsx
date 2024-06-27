import { apiClient } from "@/lib/api/apiClient";

import { repetitionMoneyData } from "@/interface/repetitionMoney-interface";

export const repetitionMoneyGetData = async () => {
  try {
    const response = await apiClient.get("/repetition_moneies");
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
    const response = await apiClient.post("/repetition_moneies", {
      repetition_money: {
        transaction_type: transaction_type,
        payment_id: payment_id,
        income_id: income_id,
        transfer_id: transfer_id,
        amount: amount,
        repetition_schedule: repetition_schedule,
      },
    });
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
    const response = await apiClient.patch(`/repetition_moneies/${id}`, {
      repetition_money: {
        transaction_type: transaction_type,
        payment_id: payment_id,
        income_id: income_id,
        transfer_id: transfer_id,
        amount: amount,
        repetition_schedule: repetition_schedule,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit repetitionMoney");
  }
};

export const repetitionMoneyDelete = async (id: string) => {
  try {
    await apiClient.delete(`/repetition_moneies/${id}`);
  } catch (error) {
    throw new Error("Failed to delete　repetitionMoney");
  }
};
