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
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const taskNew = async (
  title: string,
  purpose_id: string,
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
  body: string
): Promise<taskData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/tasks",
      {
        task: {
          title: title,
          purpose_id: purpose_id,
          schedule: schedule,
          end_date: end_date,
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
    return response.data;
  } catch (error) {
    throw new Error("Failed to post task");
  }
};

export const taskEdit = async (
  id: string,
  title: string,
  purpose_id: string,
  schedule: string,
  end_date: string,
  repetition: boolean,
  repetition_type: string,
  repetition_settings: string[],
  body: string,
  completed: boolean
): Promise<taskData> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/tasks/${id}`,
      {
        task: {
          title: title,
          purpose_id: purpose_id,
          schedule: schedule,
          end_date: end_date,
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
    return response.data;
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
  } catch (error) {
    throw new Error("Failed to delete task");
  }
};
