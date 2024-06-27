import { apiClient } from "@/lib/api/apiClient";

import { completedRepetitionTaskData } from "@/interface/task-interface";

export const completedRepetitionTaskGetData = async () => {
  try {
    const response = await apiClient.get("/completed_repetition_tasks");
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
    const response = await apiClient.post("/completed_repetition_tasks", {
      completed_repetition_task: {
        task_id: task_id,
        completed_date: completed_date,
        completed: completed,
      },
    });
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
    const response = await apiClient.patch(
      `/completed_repetition_tasks/${id}`,
      {
        completed_repetition_task: {
          task_id: task_id,
          completed_date: completed_date,
          completed: completed,
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
    await apiClient.delete(`/completed_repetition_tasks/${id}`);
  } catch (error) {
    throw new Error("Failed to delete completed_repetition_task");
  }
};
