import axios from "axios";
import Cookies from "js-cookie";

import { categoryData } from "@/interface/category-interface";

export const categoryGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/categories", {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
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
    const response = await axios.post(
      "http://localhost:3000/categories",
      {
        category: {
          name: name,
          category_type: category_type,
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
    throw new Error("Failed to post category");
  }
};

export const categoryEdit = async (
  id: string,
  name: string,
  category_type: string
): Promise<categoryData> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/categories/${id}`,
      {
        category: {
          name: name,
          category_type: category_type,
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
    throw new Error("Failed to edit category");
  }
};

export const categoryDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/categories/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
  } catch (error) {
    throw new Error("Failed to delete category");
  }
};
