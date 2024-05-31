"use client";
import React, { useState, useContext } from "react";
import moment from "moment";

import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { moneyContext } from "@/context/money-context";

import { accountEdit } from "@/lib/api/account-api";

import { categoryRowProps } from "@/interface/category-interface";

import { CategoryShow } from "@/components/money/category/show";

// 表の行コンポーネント
export const CategoryRow: React.FC<categoryRowProps> = (props) => {
  const { category, category_type, onCategoryUpdate, onCategoryDelete } = props;
  const { accounts } = useContext(moneyContext);

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistory, setIsHistory] = useState(0);

  const handleOpenEditCategoryModal = (index: number) => {
    setIsEditCategoryModalOpen(true);
    setIsHistory(index);
  };

  const handleCloseEditCategoryModal = () => {
    setIsEditCategoryModalOpen(false);
    setIsHistory(0);
  };

  const handleTransferDelete = async (id: string, index: number) => {
    const selectedBeforeAccount = accounts.find(
      (account) => account.id === row.history[index].transfer_before_account_id
    );
    const selectedAfterAccount = accounts.find(
      (account) => account.id === row.history[index].transfer_after_account_id
    );
    try {
      if (selectedBeforeAccount && selectedAfterAccount) {
        const beforeAccountEditedAmount =
          parseFloat(String(selectedBeforeAccount.amount)) +
          parseFloat(String(row.history[index].transfer_amount));
        const afterAccountEditedAmount =
          parseFloat(String(selectedAfterAccount.amount)) -
          parseFloat(String(row.history[index].transfer_amount));

        console.log(selectedBeforeAccount);
        console.log(beforeAccountEditedAmount);
        console.log(selectedAfterAccount);
        console.log(afterAccountEditedAmount);

        await accountEdit(
          selectedBeforeAccount.id,
          selectedBeforeAccount.name,
          beforeAccountEditedAmount,
          selectedBeforeAccount.body
        );
        await accountEdit(
          selectedAfterAccount.id,
          selectedAfterAccount.name,
          afterAccountEditedAmount,
          selectedAfterAccount.body
        );

        const editedBeforeAccount = {
          id: selectedBeforeAccount.id,
          name: selectedBeforeAccount.name,
          amount: beforeAccountEditedAmount,
          body: selectedBeforeAccount.body,
        };
        const editedAfterAccount = {
          id: selectedAfterAccount.id,
          name: selectedAfterAccount.name,
          amount: afterAccountEditedAmount,
          body: selectedAfterAccount.body,
        };

        onAccountUpdate(editedBeforeAccount);
        onAccountUpdate(editedAfterAccount);
        onTransferDelete(id);
      }
    } catch (error) {
      console.error("Failed to edit account:", error);
    }
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
              onUpdate={onCategoryUpdate}
              onClose={handleCloseEditCategoryModal}
              onDelete={onCategoryDelete}
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
              <IconButton onClick={() => onCategoryDelete(category.id)}>
                <DeleteIcon />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </React.Fragment>
  );
};
