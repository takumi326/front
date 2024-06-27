import axios from "axios";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api/apiClient";

import { purposeData } from "@/interface/purpose-interface";

export const purposeGetData = async () => {
  try {
    const response = await apiClient.get("/purposes");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch purpose");
  }
};

export const purposeNew = async (
  title: string,
  result: string,
  deadline: string,
  body: string
): Promise<purposeData> => {
  try {
    const response = await apiClient.post("/purposes", {
      purpose: {
        title: title,
        result: result,
        deadline: deadline,
        body: body,
        completed: false,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to post purpose");
  }
};

export const purposeEdit = async (
  id: string,
  title: string,
  result: string,
  deadline: string,
  body: string,
  completed: boolean
): Promise<purposeData> => {
  try {
    const response = await apiClient.patch(`/purposes/${id}`, {
      purpose: {
        title: title,
        result: result,
        deadline: deadline,
        body: body,
        completed: completed,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit purpose");
  }
};

export const purposeDelete = async (id: string) => {
  try {
    await apiClient.delete(`/purposes/${id}`);
  } catch (error) {
    throw new Error("Failed to delete purpose");
  }
};
