import { apiClient } from "@/lib/api/apiClient";

import { categoryData } from "@/interface/category-interface";

export const categoryGetData = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const categoryNew = async (
  name: string,
  category_type: string
): Promise<categoryData> => {
  try {
    const response = await apiClient.post("/categories", {
      category: {
        name: name,
        category_type: category_type,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to post category");
  }
};

export const categoryEdit = async (
  id: string,
  name: string,
  category_type: string
): Promise<categoryData> => {
  try {
    const response = await apiClient.patch(`/categories/${id}`, {
      category: {
        name: name,
        category_type: category_type,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit category");
  }
};

export const categoryDelete = async (id: string) => {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (error) {
    throw new Error("Failed to delete category");
  }
};
