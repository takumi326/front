"use client";
import React, { useState, ChangeEvent } from "react";
import moment from "moment";

import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { taskEdit as Edit } from "@/lib/api/task-api";
import { taskRowProps, taskData } from "@/interface/task-interface";

import { TaskShow } from "@/components/task/show";

// 表の行コンポーネント
export const TaskRow: React.FC<taskRowProps> = (props) => {
  const { row, onSelect, isSelected, visibleColumns, onUpdate, onDelete } =
    props;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(row.completed);

  const handleTitleClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(row.id, row.completed);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ""; // 日付が未定義の場合は空文字を返す

    return moment(date).format("MM/DD/YY");
  };

  const handleCompletionToggle = async (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    try {
      const updatedRow = { ...row, completed: !isChecked };
      await Edit(
        updatedRow.id,
        updatedRow.title,
        updatedRow.purpose_id,
        updatedRow.schedule,
        updatedRow.repetition,
        updatedRow.repetition_type,
        updatedRow.repetition_settings,
        updatedRow.body,
        updatedRow.completed
      );
      setIsChecked(!isChecked);
      onUpdate(updatedRow);
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
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
            <TaskShow
              id={row.id}
              title={row.title}
              purpose_id={row.purpose_id}
              purpose_title={row.purpose_title}
              schedule={row.schedule}
              repetition={row.repetition}
              repetition_type={row.repetition_type}
              repetition_settings={row.repetition_settings}
              body={row.body}
              completed={row.completed}
              onUpdate={onUpdate}
              onClose={handleEditCloseModal}
            />
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
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected} onChange={handleCheckboxChange} />
        </TableCell>
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
                  {row.title}
                </button>
              ) : key === "schedule" ? (
                formatDate(row.schedule)
              ) : (
                String(row[key as keyof taskData])
              )}
            </TableCell>
          ) : null
        )}
        <TableCell align="right">
          <Checkbox checked={row.completed} onChange={handleCompletionToggle} />
          <IconButton onClick={() => onDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
