import { apiClient } from "@/lib/api/apiClient";

import { accountData } from "@/interface/account-interface";

export const accountGetData = async () => {
  try {
    const response = await apiClient.get("/accounts");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const accountNew = async (
  name: string,
  amount: number,
  body: string
): Promise<accountData> => {
  try {
    const response = await apiClient.post("/accounts", {
      account: {
        name: name,
        amount: amount,
        body: body,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to post account");
  }
};

export const accountEdit = async (
  id: string,
  name: string,
  amount: number,
  body: string
): Promise<accountData> => {
  if (!name) {
    console.error("Name field is empty. Request not sent.");
    throw new Error("Name field cannot be empty.");
  }
  try {
    const response = await apiClient.patch(`/accounts/${id}`, {
      account: {
        name: name,
        amount: amount,
        body: body,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit account");
  }
};

export const accountDelete = async (id: string) => {
  try {
    await apiClient.delete(`/accounts/${id}`);
  } catch (error) {
    throw new Error("Failed to delete account");
  }
};
