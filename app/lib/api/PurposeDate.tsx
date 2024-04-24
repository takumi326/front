import axios from "axios";
import Cookies from "js-cookie";

export async function PurposeGetData() {
  try {
    const response = await axios.get("http://localhost:3000/purposes", {
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
}

export async function PurposeNew(
  title: string,
  result: string,
  deadline: Date,
  body: string
) {
  try {
    const response = await axios.post(
      "http://localhost:3000/purposes",
      {
        purpose: {
          title: title,
          result: result,
          deadline: deadline,
          body: body,
          completed: false,
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
    return response;
  } catch (error) {
    throw new Error("Failed to post purpose");
  }
}

export async function PurposeEdit(
  id: string,
  title: string,
  result: string,
  deadline: Date,
  body: string,
  completed: boolean
) {
  try {
    const response = await axios.patch(
      `http://localhost:3000/purposes/${id}`,
      {
        purpose: {
          title: title,
          result: result,
          deadline: deadline,
          body: body,
          completed: completed,
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
    return response;
  } catch (error) {
    throw new Error("Failed to edit purpose");
  }
}

export async function PurposeDelete(id: string) {
  try {
    await axios.delete(`http://localhost:3000/purposes/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("delete成功");
  } catch (error) {
    throw new Error("Failed to delete purpose");
  }
}
