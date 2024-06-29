"use client";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";

import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { taskContext } from "@/context/task-context";

import { taskEdit, taskDelete } from "@/lib/api/task-api";
import {
  completedRepetitionTaskEdit,
  completedRepetitionTaskDelete,
} from "@/lib/api/completedRepetitionTask-api";

import { taskRowProps, taskData } from "@/interface/task-interface";

import { TaskShow } from "@/components/task/show";

export const TaskRow: React.FC<taskRowProps> = (props) => {
  const { row, onSelect, isSelected, visibleColumns } = props;
  const {
    allTasks,
    completedRepetitionTasks,
    setIsEditing,
    loading,
    setLoading,
  } = useContext(taskContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(row.completed);
  const [schedule, setSchedule] = useState("");
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (allTasks) {
      let task: taskData | undefined;
      if (row.repetition === true) {
        task = allTasks.filter(
          (task) =>
            task.id ===
            completedRepetitionTasks.filter(
              (completedRepetitionTask) => completedRepetitionTask.id === row.id
            )[0].task_id
        )[0];
      } else {
        task = allTasks.find((task: taskData) => task.id === row.id);
      }
      if (task && task.repetition === true) {
        setSchedule(task.schedule);
        setCompleted(task.completed);
      }
    }
  }, [row.id, allTasks]);

  const handleTitleClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCheckboxChange = () => {
    onSelect(row.id, row.completed);
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      if (row.repetition === true) {
        await completedRepetitionTaskDelete(id);
      } else {
        await taskDelete(id);
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletionToggle = async () => {
    setLoading(true);
    try {
      if (row.repetition === true) {
        await completedRepetitionTaskEdit(
          row.id,
          allTasks.filter(
            (task) =>
              task.id ===
              completedRepetitionTasks.filter(
                (completedRepetitionTask) =>
                  completedRepetitionTask.id === row.id
              )[0].task_id
          )[0].id,
          row.schedule,
          !isChecked
        );
      } else {
        const updatedRow = { ...row, completed: !isChecked };
        await taskEdit(
          updatedRow.id,
          updatedRow.title,
          updatedRow.purpose_id,
          updatedRow.schedule,
          updatedRow.end_date,
          updatedRow.repetition,
          updatedRow.repetition_type,
          updatedRow.repetition_settings,
          updatedRow.body,
          updatedRow.completed
        );
      }
      setIsChecked(!isChecked);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit task:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderRepetition = () => {
    if (!row.repetition || !row.repetition_settings) return "";

    const { repetition_type, repetition_settings } = row;

    if (repetition_type === "daily" && Number(repetition_settings[0]) === 1) {
      return "毎日";
    } else if (
      repetition_type === "weekly" &&
      Number(repetition_settings[0]) === 1
    ) {
      return `毎週 ${repetition_settings.slice(1).join(" ")}`;
    } else if (
      repetition_type === "monthly" &&
      Number(repetition_settings[0]) === 1
    ) {
      return "毎月";
    } else if (Number(repetition_settings[0]) > 1) {
      return `毎${repetition_settings[0]}${
        repetition_type === "daily"
          ? "日"
          : repetition_type === "weekly"
          ? `週 ${repetition_settings.slice(1).join(" ")}`
          : "月"
      }`;
    } else {
      return "";
    }
  };

  const formatDate = (date: string): string => {
    if (!date) return "";
    return moment(date).format("MM/DD/YY");
  };

  return (
    <React.Fragment>
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleEditCloseModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            {row.repetition === false ? (
              <TaskShow
                id={row.id}
                title={row.title}
                purpose_id={row.purpose_id}
                schedule={row.schedule}
                end_date={row.end_date}
                repetition={row.repetition}
                repetition_type={row.repetition_type}
                repetition_settings={row.repetition_settings}
                body={row.body}
                completed={row.completed}
                onClose={handleEditCloseModal}
              />
            ) : (
              <TaskShow
                id={
                  allTasks.filter(
                    (task) =>
                      task.id ===
                      completedRepetitionTasks.filter(
                        (completedRepetitionTask) =>
                          completedRepetitionTask.id === row.id
                      )[0].task_id
                  )[0].id
                }
                title={row.title}
                purpose_id={row.purpose_id}
                schedule={schedule}
                end_date={row.end_date}
                repetition={row.repetition}
                repetition_type={row.repetition_type}
                repetition_settings={row.repetition_settings}
                body={row.body}
                completed={completed}
                onClose={handleEditCloseModal}
              />
            )}
          </div>
        </div>
      )}

      <TableRow
        sx={{
          "& > *": {
            borderBottom: "unset",
            backgroundColor: isSelected ? "#f5f5f5" : "transparent",
          },
        }}
      >
        {row.repetition === false ? (
          <TableCell padding="checkbox">
            <Checkbox checked={isSelected} onChange={handleCheckboxChange} />
          </TableCell>
        ) : (
          <TableCell padding="checkbox"></TableCell>
        )}
        {Object.keys(visibleColumns).map((key) =>
          visibleColumns[key] ? (
            <TableCell key={key} component="th" scope="row">
              {key === "title" ? (
                <button
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={handleTitleClick}
                >
                  {row.repetition === true
                    ? `${row.title}(${formatDate(row.schedule)})`
                    : row.title}
                </button>
              ) : key === "schedule" ? (
                formatDate(row.schedule)
              ) : key === "purpose_title" ? (
                row.purpose_title !== null ? (
                  row.purpose_title
                ) : (
                  ""
                )
              ) : key === "repetition_type" ? (
                renderRepetition()
              ) : (
                String(row[key as keyof taskData])
              )}
            </TableCell>
          ) : null
        )}
        <TableCell align="right">
          {loading ? (
            <Typography variant="subtitle1">...</Typography>
          ) : (
            <>
              <Checkbox
                checked={row.completed}
                onChange={handleCompletionToggle}
              />
              <IconButton onClick={() => deleteTask(row.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
