import axios from "axios";
import Cookies from "js-cookie";

import { categoryData } from "@/interface/category-interface";

export const categoryGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/categorys", {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("get成功");
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
      "http://localhost:3000/categorys",
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
    console.log("new成功");
    // レスポンスから作成された目的の情報を抽出して返す
    return response.data;
  } catch (error) {
    throw new Error("Failed to post category");
  }
};

export const categoryEdit = async (
  id: string,
  name: string,
  category_type: string
) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/categorys/${id}`,
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
    console.log("update成功");
    console.log(response);
    return response;
  } catch (error) {
    throw new Error("Failed to edit category");
  }
};

export const categoryDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/categorys/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("delete成功");
  } catch (error) {
    throw new Error("Failed to delete category");
  }
};
