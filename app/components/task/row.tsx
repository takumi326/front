"use client";
import React, { useState, ChangeEvent } from "react";
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
    console.log(row);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(row.id, row.completed);
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

  const renderRepetition = () => {
    if (!row.repetition || !row.repetition_settings) return ""; // 繰り返し設定がオフまたは未定義の場合は空文字を返す

    const { repetition_type, repetition_settings } = row;

    if (repetition_type === "daily" && repetition_settings[0] === 1) {
      return "毎日";
    } else if (repetition_type === "weekly" && repetition_settings[0] === 1) {
      return `毎週 ${repetition_settings.slice(1).join(" ")}`;
    } else if (repetition_type === "monthly" && repetition_settings[0] === 1) {
      return "毎月";
    } else if (repetition_settings[0] > 1) {
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

  const calculateNextSchedule = () => {
    const { schedule, repetition, repetition_type, repetition_settings } = row;
    if (!repetition) return ""; // 繰り返し設定がオフの場合は空文字を返す

    // 曜日名を整数にマッピングする関数
    const mapDayOfWeekToInt = (dayOfWeek) => {
      switch (dayOfWeek) {
        case "月":
          return 1;
        case "火":
          return 2;
        case "水":
          return 3;
        case "木":
          return 4;
        case "金":
          return 5;
        case "土":
          return 6;
        case "日":
          return 0;
        default:
          return NaN; // 不正な曜日名の場合はNaNを返す
      }
    };

    const date = new Date(schedule);
    const currentDate = date.getTime(); // 予定の日時をミリ秒で取得
    const currentMonth = date.getMonth(); // 予定の日付の月を取得
    const currentYear = date.getFullYear(); // 予定の日付の年を取得
    let nextSchedule = currentDate; // 次の予定日の初期値を現在の日時とする

    switch (repetition_type) {
      case "daily":
        nextSchedule += repetition_settings[0] * 24 * 60 * 60 * 1000; // 日単位で1日後に設定
        break;

      case "weekly":
        if (repetition_settings.length > 1) {
          const targetDaysOfWeek = repetition_settings
            .slice(1)
            .map(mapDayOfWeekToInt);
          const currentDayOfWeek = date.getDay(); // 現在の曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
          let daysUntilNextSchedule = 1;

          // 現在の曜日が次の予定日の曜日リストに含まれていない場合、次の予定日を計算
          for (let i = 1; i <= 7; i++) {
            const nextDayOfWeek = (currentDayOfWeek + i) % 7; // 翌日の曜日を計算
            if (targetDaysOfWeek.includes(nextDayOfWeek)) {
              daysUntilNextSchedule = i;
              break;
            }
          }

          // 現在の曜日と次の予定日の曜日が同じ場合、次の予定日を1日進めてから計算
          if (daysUntilNextSchedule === 0) {
            date.setDate(date.getDate() + 1);
            daysUntilNextSchedule = 7;
          }

          nextSchedule +=
            (daysUntilNextSchedule + (repetition_settings[0] - 1) * 7) *
            24 *
            60 *
            60 *
            1000;
        }
        break;

      case "monthly":
        // 次の予定日の年と月を計算
        let nextYear = currentYear;
        let nextMonth = currentMonth + repetition_settings[0];
        if (nextMonth === 12) {
          nextYear++;
          nextMonth = 0; // 0 は 1 月を表す
        }

        // 次の予定日を計算
        const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const nextDayOfMonth = Math.min(date.getDate(), daysInNextMonth);
        const nextDate = new Date(nextYear, nextMonth, nextDayOfMonth);
        nextSchedule = nextDate.getTime();
        break;

      default:
        break;
    }

    // 次の予定日を Date オブジェクトに変換して返す
    return new Date(nextSchedule);
  };

  const nextSchedule = calculateNextSchedule();

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ""; // 日付が未定義の場合は空文字を返す

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
              onDelete={onDelete}
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
              ) : key === "purpose_title" ? (
                row.purpose_title !== null ? (
                  row.purpose_title
                ) : (
                  ""
                )
              ) : key === "repetition_type" ? (
                <>
                  {renderRepetition()}
                  {row.repetition === true && (
                    <Typography>
                      次回の予定：{formatDate(nextSchedule)}
                    </Typography>
                  )}
                </>
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
