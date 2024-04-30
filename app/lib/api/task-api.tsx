import axios from "axios";
import Cookies from "js-cookie";

import { taskData } from "@/interface/task-interface";

export const taskGetData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/tasks", {
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

export const taskNew = async (
  title: string,
  schedule: string,
  time: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string,
  body: string
): Promise<taskData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/tasks",
      {
        task: {
          title: title,
          schedule: schedule,
          time: time,
          repetition: repetition,
          repetition_type: repetition_type,
          repetition_settings: repetition_settings,
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
    // レスポンスから作成された目的の情報を抽出して返す
    return response.data;
  } catch (error) {
    throw new Error("Failed to post task");
  }
};

export const taskEdit = async (
  id: string,
  title: string,
  schedule: string,
  time: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string,
  body: string,
  completed: boolean
) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/tasks/${id}`,
      {
        task: {
          title: title,
          schedule: schedule,
          time: time,
          repetition: repetition,
          repetition_type: repetition_type,
          repetition_settings: repetition_settings,
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
    throw new Error("Failed to edit task");
  }
};

export const taskDelete = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/tasks/${id}`, {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    });
    console.log("delete成功");
  } catch (error) {
    throw new Error("Failed to delete task");
  }
};
