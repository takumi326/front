"use client";
import React, { useState, useEffect } from "react";

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

import { purposeData, selectPurposeData } from "@/interface/purpose-interface";
import { taskData, selectTaskData } from "@/interface/task-interface";
import { Props } from "@/interface/purpose-task";

type dataType = purposeData | taskData;
type selectData = selectPurposeData | selectTaskData;

export const TableShow: React.FC<Props> = (props) => {
  const { columnNames, getData, Delete, Row, New } = props;
  const [datas, setDatas] = useState<dataType[]>([]);
  const [completedDatas, setCompletedDatas] = useState<dataType[]>([]);
  const [incompleteDatas, setIncompleteDatas] = useState<dataType[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "incomplete"
  );
  const [displayedDatas, setDisplayedDatas] = useState<dataType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [completedSelected, setCompletedSelected] = useState<string[]>([]);
  const [incompleteSelected, setIncompleteSelected] = useState<string[]>([]);

  const rows: dataType[] = datas.map((item) => {
    if (item.hasOwnProperty("schedule")) {
      // タスクのデータ
      return {
        id: item.id,
        title: item.title,
        purpose_id: item.purpopse_id,
        purpose_title: item.purpopse_title,
        schedule: item.schedule,
        time: item.time,
        repetition: item.repetition,
        repetition_type: item.repetition_type,
        repetition_settings: item.repetition_settings,
        completed: item.completed,
        body: item.body,
      };
    } else {
      // 目的のデータ
      return {
        id: item.id,
        title: item.title,
        result: item.result,
        deadline: item.deadline,
        body: item.body,
        completed: item.completed,
      };
    }
  });

  const selectrows: selectData[] = datas.map((item) => {
    if (item.hasOwnProperty("schedule")) {
      return {
        title: item.title,
        purpose_title: item.purpopse_title,
        schedule: item.schedule,
        repetition_type: item.repetition_type,
        repetition_settings: item.repetition_settings,
        time: item.time,
      };
    } else {
      return {
        title: item.title,
        result: item.result,
        deadline: item.deadline,
      };
    }
  });

  const [orderBy, setOrderBy] = React.useState<keyof (typeof rows)[0]>();

  const [order, setOrder] = React.useState<{
    task: {
      [key: string]: "asc" | "desc" | "default";
    };
    purpose: {
      [key: string]: "asc" | "desc" | "default";
    };
  }>({
    task: {
      title: "default",
      purpose_title: "default",
      schedule: "asc",
      repetition_type: "default",
      time: "default",
      // タスクの他の属性を追加
    },
    purpose: {
      title: "default",
      result: "default",
      deadline: "asc",
      // 目的の他の属性を追加
    },
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [columnSettings, setColumnSettings] = useState<{
    [key: string]: boolean;
  }>(() => {
    if (rows.length > 0) {
      const initialSettings: { [key: string]: boolean } = {};
      Object.keys(rows[0]).forEach((key) => {
        initialSettings[key] = true;
      });
      return initialSettings;
    } else {
      // rows が空の場合は適切な初期設定を行う
      return {
        title: true,
        result: true,
        deadline: true,
      };
    }
  });

  useEffect(() => {
    getData().then((data) => {
      setDatas(data);
    });
  }, [isEditing, isAdding]);

  useEffect(() => {
    setIsEditing(false);
    setIsAdding(false);
  }, [datas]);

  useEffect(() => {
    const completed = datas.filter((data) => data.completed);
    const incomplete = datas.filter((data) => !data.completed);
    setCompletedDatas(completed);
    setIncompleteDatas(incomplete);
    setDisplayedDatas(datas);
  }, [datas, isEditing, isAdding]);

  useEffect(() => {
    let filteredDatas: dataType[] = [];
    if (filter === "all") {
      filteredDatas = datas;
    } else if (filter === "completed") {
      filteredDatas = completedDatas;
    } else if (filter === "incomplete") {
      filteredDatas = incompleteDatas;
    }
    // 表示される目的を設定
    setDisplayedDatas(filteredDatas);
  }, [filter, datas, completedDatas, incompleteDatas]);

  const handleFilterChange = (value: "all" | "completed" | "incomplete") => {
    setFilter(value);
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewModalOpen(false);
  };

  // TableShow コンポーネント内での更新処理
  const newData = (newData: dataType) => {
    setDatas([...datas, newData]);
    setIsEditing(true);
  };

  // TableShow コンポーネント内での更新処理
  const updateData = (updateData: dataType) => {
    const updatedDatas = datas.map((data) => {
      if (data.id === updateData.id) {
        return updateData; // 編集されたデータで該当の目的を更新
      }
      return data;
    });
    setDatas(updatedDatas); // 更新された Datas ステートを設定
    setIsAdding(true);
  };

  const deleteData = async (id: string) => {
    try {
      console.log(id);
      await Delete(id);
      setDatas(datas.filter((data) => data.id !== id)); // UIからも削除
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const deleteAllData = async (ids: string[]) => {
    try {
      // 複数のIDに対して削除を実行
      await Promise.all(ids.map((id) => Delete(id)));
      // UIからも削除
      setDatas(datas.filter((data) => !ids.includes(data.id)));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleRequestSort = (property: keyof (typeof rows)[0]) => {
    let newOrder: "asc" | "desc" | "default" = "asc";
    if (orderBy === property) {
      // すでにソートされているカラムをクリックした場合、ソート順を切り替える
      newOrder =
        order[property] === "asc"
          ? "desc"
          : order[property] === "desc"
          ? "default"
          : "asc";
    }
    const newOrderState = { ...order, [property]: newOrder };
    setOrder(newOrderState);
    setOrderBy(property);
  };

  // データをソートする関数
  const sortedRows = displayedDatas.slice().sort((a, b) => {
    const compare = (key: keyof (typeof rows)[0]) => {
      if (order[key] === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else if (order[key] === "desc") {
        return a[key] < b[key] ? 1 : -1;
      }
      return 0;
    };
    return compare(orderBy);
  });

  const handleSelectAllClick = () => {
    if (filter === "incomplete") {
      if (incompleteSelected.length === incompleteDatas.length) {
        setIncompleteSelected([]);
        setSelected(selected.filter((id) => !incompleteSelected.includes(id)));
      } else {
        const allIds = incompleteDatas.map((data) => data.id);
        setIncompleteSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else if (filter === "completed") {
      if (completedSelected.length === completedDatas.length) {
        setCompletedSelected([]);
        setSelected(selected.filter((id) => !completedSelected.includes(id)));
      } else {
        const allIds = completedDatas.map((data) => data.id);
        setCompletedSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else {
      if (selected.length === datas.length) {
        setCompletedSelected([]);
        setIncompleteSelected([]);
        setSelected([]);
      } else {
        const allIds = datas.map((data) => data.id);
        const allCompletedIds = completedDatas.map((data) => data.id);
        const allIncompleteIds = incompleteDatas.map((data) => data.id);
        setCompletedSelected(allCompletedIds);
        setIncompleteSelected(allIncompleteIds);
        setSelected(allIds);
      }
    }
  };

  const handleSelect = (id: string, completed: boolean) => {
    if (completed) {
      if (completedSelected.includes(id)) {
        setCompletedSelected(completedSelected.filter((item) => item !== id));
        setSelected(completedSelected.filter((item) => item !== id));
      } else {
        setCompletedSelected([...completedSelected, id]);
        setSelected([...selected, id]);
      }
    } else {
      if (incompleteSelected.includes(id)) {
        setIncompleteSelected(incompleteSelected.filter((item) => item !== id));
        setSelected(incompleteSelected.filter((item) => item !== id));
      } else {
        setIncompleteSelected([...incompleteSelected, id]);
        setSelected([...selected, id]);
      }
    }
  };

  const isSelected = (id: string, completed: boolean) => {
    if (completed) {
      return completedSelected.includes(id);
    } else {
      return incompleteSelected.includes(id);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColumnToggle = (property: keyof selectData) => {
    setColumnSettings((prevSettings) => ({
      ...prevSettings,
      [property]: !prevSettings[property],
    }));
  };

  const visibleColumns = Object.fromEntries(
    Object.entries(columnSettings).filter(([key, value]) => value)
  );

  const handleDelete = (id: string) => {
    deleteData(id);
  };

  const handleAllDelete = () => {
    deleteAllData(selected);
    setCompletedSelected([]); // 選択をクリア
    setIncompleteSelected([]); // 選択をクリア
    setSelected([]); // 選択をクリア
  };

  const handleNewCloseModal = () => {
    setIsNewModalOpen(false);
  };

  return (
    <Box>
      {isNewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div className="absolute inset-0 bg-gray-900 opacity-75 "></div>
          <div className="bg-white rounded-lg p-8 z-50 relative bg-slate-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
            <New onAdd={newData} onClose={handleNewCloseModal} />
          </div>
        </div>
      )}
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant={filter === "incomplete" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("incomplete")}
          >
            未完了
          </Button>
          <Button
            variant={filter === "completed" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("completed")}
          >
            完了
          </Button>
          <Button
            variant={filter === "all" ? "contained" : "outlined"}
            onClick={() => handleFilterChange("all")}
          >
            すべて
          </Button>
        </Stack>
        <Button
          aria-controls="column-menu"
          aria-haspopup="true"
          onClick={selected.length > 0 ? undefined : handleMenuClick}
        >
          {selected.length > 0 ? (
            <DeleteIcon onClick={() => handleAllDelete()} />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewClick}
          className="ml-auto"
        >
          新規作成
        </Button>
      </Stack>
      <Menu
        id="column-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {rows.length > 0 &&
          Object.keys(selectrows[0]).map((key) => (
            <MenuItem
              key={key}
              onClick={() => handleColumnToggle(key as keyof selectData)}
            >
              <Checkbox checked={columnSettings[key]} />
              {columnNames[key as keyof selectData]}
            </MenuItem>
          ))}
      </Menu>
      <TableContainer component={Paper} sx={{ maxHeight: 620 }}>
        <Table stickyHeader aria-label="collapsible table sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    filter === "incomplete"
                      ? incompleteSelected.length > 0 &&
                        incompleteSelected.length <
                          rows.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length <
                          rows.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 && selected.length < rows.length
                      : false
                  }
                  checked={
                    filter === "incomplete"
                      ? incompleteSelected.length > 0 &&
                        incompleteSelected.length ===
                          rows.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length ===
                          rows.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 && selected.length === rows.length
                      : false
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {Object.keys(visibleColumns).map((key) => (
                <TableCell key={key}>
                  <Stack direction="row" alignItems="center">
                    <Typography>
                      {columnNames[key as keyof selectData]}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        handleRequestSort(key as keyof (typeof rows)[0])
                      }
                    >
                      {orderBy === key ? (
                        order[key] === "asc" ? (
                          <KeyboardArrowUpIcon />
                        ) : order[key] === "desc" ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <span>〇</span>
                        )
                      ) : (
                        <span>〇</span>
                      )}
                    </IconButton>
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <Row
                key={row.title}
                row={row}
                onSelect={handleSelect}
                isSelected={isSelected(row.id, row.completed)}
                visibleColumns={visibleColumns}
                onUpdate={updateData}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
