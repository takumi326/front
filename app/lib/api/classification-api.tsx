import { apiClient } from "@/lib/api/apiClient";

import { classificationData } from "@/interface/classification-interface";

export const classificationGetData = async () => {
  try {
    const response = await apiClient.get("/classifications");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const classificationNew = async (
  account_id: string,
  name: string,
  classification_type: string
): Promise<classificationData> => {
  try {
    const response = await apiClient.post("/classifications", {
      classification: {
        account_id: account_id,
        name: name,
        classification_type: classification_type,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to post classification");
  }
};

export const classificationEdit = async (
  id: string,
  account_id: string,
  name: string,
  classification_type: string
): Promise<classificationData> => {
  try {
    const response = await apiClient.patch(`/classifications/${id}`, {
      classification: {
        account_id: account_id,
        name: name,
        classification_type: classification_type,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit classification");
  }
};

export const classificationDelete = async (id: string) => {
  try {
    await apiClient.delete(`/classifications/${id}`);
  } catch (error) {
    throw new Error("Failed to delete classification");
  }
};
