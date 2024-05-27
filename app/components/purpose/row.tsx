"use client";
import React, { useState, ChangeEvent, useContext } from "react";
import moment from "moment";

import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { purposeContext } from "@/context/purpose-context";

import { purposeEdit, purposeDelete } from "@/lib/api/purpose-api";

import { purposeRowProps, purposeData } from "@/interface/purpose-interface";

import { PurposeShow } from "@/components/purpose/show";

export const PurposeRow: React.FC<purposeRowProps> = (props) => {
  const { row, onSelect, isSelected, visibleColumns  } = props;
  const { setIsEditing } = useContext(purposeContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(row.completed);

  const handleTitleClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCheckboxChange = () => {
    onSelect(row.id, row.completed);
  };

  const formatDate = (date: string): string => {
    if (!date) return "";
    return moment(date).format("MM/DD/YY");
  };

  const deletePurpose = async (id: string) => {
    try {
      await purposeDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete purpose:", error);
    }
  };

  const handleCompletionToggle = async () => {
    try {
      const updatedRow = { ...row, completed: !isChecked };
      await purposeEdit(
        updatedRow.id,
        updatedRow.title,
        updatedRow.result,
        updatedRow.deadline,
        updatedRow.body,
        updatedRow.completed
      );
      setIsChecked(!isChecked);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to edit purpose:", error);
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
            <PurposeShow
              id={row.id}
              title={row.title}
              result={row.result}
              deadline={row.deadline}
              body={row.body}
              completed={row.completed}
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
              ) : key === "deadline" ? (
                formatDate(row.deadline)
              ) : (
                String(row[key as keyof purposeData])
              )}
            </TableCell>
          ) : null
        )}
        <TableCell align="right">
          <Checkbox checked={row.completed} onChange={handleCompletionToggle} />
          <IconButton onClick={() => deletePurpose(row.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
