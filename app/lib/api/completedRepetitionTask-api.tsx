import axios from "axios";
import Cookies from "js-cookie";

import { completedRepetitionTaskData } from "@/interface/task-interface";

export const completedRepetitionTaskGetData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/completed_repetition_tasks",
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
    throw new Error("Failed to fetch completed_repetition_task");
  }
};

export const completedRepetitionTaskNew = async (
  task_id: string,
  completed_date: string,
  completed: boolean
): Promise<completedRepetitionTaskData> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/completed_repetition_tasks",
      {
        completed_repetition_task: {
          task_id: task_id,
          completed_date: completed_date,
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
    throw new Error("Failed to post completed_repetition_task");
  }
};

export const completedRepetitionTaskEdit = async (
  id: string,
  task_id: string,
  completed_date: string,
  completed: boolean
) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/completed_repetition_tasks/${id}`,
      {
        completed_repetition_task: {
          task_id: task_id,
          completed_date: completed_date,
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
    throw new Error("Failed to edit completed_repetition_task");
  }
};

export const completedRepetitionTaskDelete = async (id: string) => {
  try {
    await axios.delete(
      `http://localhost:3000/completed_repetition_tasks/${id}`,
      {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      }
    );
  } catch (error) {
    throw new Error("Failed to delete completed_repetition_task");
  }
};
