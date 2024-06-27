import { apiClient } from "@/lib/api/apiClient";

import { paymentData } from "@/interface/payment-interface";

export const paymentGetData = async () => {
  try {
    const response = await apiClient.get("/payments");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const paymentNew = async (
  category_id: string,
  classification_id: string,
  amount: number,
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
  body: string
): Promise<paymentData> => {
  try {
    const response = await apiClient.post("/payments", {
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
    });
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
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
  body: string
): Promise<paymentData> => {
  try {
    const response = await apiClient.patch(`/payments/${id}`, {
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
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit payment");
  }
};

export const paymentDelete = async (id: string) => {
  try {
    await apiClient.delete(`/payments/${id}`);
  } catch (error) {
    throw new Error("Failed to delete payment");
  }
};
