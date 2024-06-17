"use client";
import React, { useState, useContext } from "react";

import {
  Typography,
  IconButton,
  TableCell,
  TableRow,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { taskContext } from "@/context/task-context";

import { repetitionTaskRowProps } from "@/interface/task-interface";

import { completedRepetitionTaskEdit } from "@/lib/api/completedRepetitionTask-api";

import { InputDateTime } from "@/components/inputdatetime/InputDateTime";

export const RepetitionTaskRow: React.FC<repetitionTaskRowProps> = (props) => {
  const { id, task_id, completed_date, completed, onChange, onDelete } = props;
  const { completedRepetitionTasks, setIsEditing, loading, setLoading } =
    useContext(taskContext);

  const [editRepetitionSchedule, setEditRepetitionSchedule] =
    useState(completed_date);
  const [editRepetitionCompleted, setEditRepetitionCompleted] =
    useState<boolean>(completed);

  const handleSchedulChange = async (date: Date) => {
    const stringDate = date.toLocaleDateString().split("T")[0];
    setEditRepetitionSchedule(stringDate);
    onChange(id, stringDate);
  };

  const handleCompletionToggle = async () => {
    setLoading(true);
    try {
      await completedRepetitionTaskEdit(
        id,
        task_id,
        completed_date,
        !editRepetitionCompleted
      );

      setEditRepetitionCompleted(!editRepetitionCompleted);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        key={id}
        sx={{
          "& > *": {
            borderBottom: "unset",
            backgroundColor:
              completedRepetitionTasks.filter(
                (completedRepetitionTask) => completedRepetitionTask.id === id
              )[0].completed === false
                ? "#f5f5f5"
                : "#bfbfbf",
          },
        }}
      >
        <TableCell component="th" scope="row">
          <InputDateTime
            selectedDate={editRepetitionSchedule}
            onChange={handleSchedulChange}
          />
        </TableCell>
        <TableCell align="right">
          {loading ? (
            <Typography variant="subtitle1">...</Typography>
          ) : (
            <>
              <Checkbox
                checked={editRepetitionCompleted}
                onChange={handleCompletionToggle}
              />
              <IconButton onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
