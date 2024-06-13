"use client";
import React, { useState, useContext } from "react";

import { IconButton, TableBody, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { categoryRowProps } from "@/interface/category-interface";
import { categoryDelete } from "@/lib/api/category-api";
import { CategoryShow } from "@/components/money/category/show";

export const CategoryRow: React.FC<categoryRowProps> = (props) => {
  const { category, category_type } = props;
  const { setIsEditing, setLoading } = useContext(moneyContext);

  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);

  const deleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await categoryDelete(id);
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditCategoryModal = () => {
    setIsEditCategoryModalOpen(true);
  };

  const handleCloseEditCategoryModal = () => {
    setIsEditCategoryModalOpen(false);
  };

  return (
    <React.Fragment>
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseEditCategoryModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <CategoryShow
              id={category.id}
              name={category.name}
              category_type={category.category_type}
              onClose={handleCloseEditCategoryModal}
              onDelete={deleteCategory}
            />
          </div>
        </div>
      )}

      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row">
            {category.category_type === category_type &&
              (category.user_id !== null ? (
                <button
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={handleOpenEditCategoryModal}
                >
                  {category.name}
                </button>
              ) : (
                category.name
              ))}
          </TableCell>
          <TableCell align="right">
            {category.user_id !== null && (
              <IconButton onClick={() => deleteCategory(category.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </React.Fragment>
  );
};
