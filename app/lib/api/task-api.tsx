import { apiClient } from "@/lib/api/apiClient";

import { taskData } from "@/interface/task-interface";

export const taskGetData = async () => {
  try {
    const response = await apiClient.get("/tasks");
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
    const response = await apiClient.post("/tasks", {
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
    });
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
    const response = await apiClient.patch(`/tasks/${id}`, {
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
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to edit task");
  }
};

export const taskDelete = async (id: string) => {
  try {
    await apiClient.delete(`/tasks/${id}`);
  } catch (error) {
    throw new Error("Failed to delete task");
  }
};
