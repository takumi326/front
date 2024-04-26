"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";

import { PurposeShow } from "@/components/purpose/show";
import { PurposeNew } from "@/components/purpose/new";
import { PurposeEdit as Edit } from "@/lib/api/PurposeDate";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import {
  PurposeGetData as getData,
  PurposeDelete as Delete,
} from "@/lib/api/PurposeDate";

// 列名を日本語に変換する辞書
const columnNames = {
  title: "項目",
  result: "目標",
  deadline: "期限",
};

// コンポーネントで使用する Props の型を定義
interface ComponentProps {
  row: Purpose; // row に Purpose 型を適用
  onSelect: (id: string) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: any[]; // 適切な型を指定する必要があります
  onDelete: (id: string) => void; // onDelete の型を指定
  onEdit: (purpose: Purpose) => void; // onEdit の型を指定
}

// Purposeの型定義
type Purpose = {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
};

// 表の行コンポーネント
const Row: React.FC<ComponentProps> = (props) => {
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

  const handleCheckboxChange = (event) => {
    event.stopPropagation();
    onSelect(row.id, row.completed);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return ""; // 日付が未定義の場合は空文字を返す

    return moment(date).format("MM/DD/YY");
  };

  const handleUpdate = (checked) => {
    const updatedRow = { checked };
    onUpdate(updatedRow);
  };

  const handleCompletionToggle = async (event) => {
    event.stopPropagation();
    try {
      const updatedRow = { ...row, completed: !isChecked };
      await Edit(
        updatedRow.id,
        updatedRow.title,
        updatedRow.result,
        updatedRow.deadline,
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
            <PurposeShow
              id={row.id}
              title={row.title}
              result={row.result}
              deadline={row.deadline}
              body={row.body}
              completed={row.completed}
              onEdit={handleUpdate}
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
                row[key]
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

export function TableShow() {
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [completedPurposes, setCompletedPurposes] = useState<Purpose[]>([]);
  const [incompletePurposes, setIncompletePurposes] = useState<Purpose[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "incomplete"
  );
  const [displayedPurposes, setDisplayedPurposes] = useState<Purpose[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [completedSelected, setCompletedSelected] = useState<string[]>([]);
  const [incompleteSelected, setIncompleteSelected] = useState<string[]>([]);

  const rows = purposes.map((item) => ({
    id: item.id,
    title: item.title,
    result: item.result,
    deadline: item.deadline,
    body: item.body,
    completed: item.completed,
  }));

  const selectrows = purposes.map((item) => ({
    title: item.title,
    result: item.result,
    deadline: item.deadline,
  }));

  useEffect(() => {
    getData().then((data) => {
      setPurposes(data);
    });
  }, [isEditing, isAdding]);

  useEffect(() => {
    setIsEditing(false);
    setIsAdding(false);
  }, [purposes]);

  useEffect(() => {
    const completed = purposes.filter((purpose) => purpose.completed);
    const incomplete = purposes.filter((purpose) => !purpose.completed);
    setCompletedPurposes(completed);
    setIncompletePurposes(incomplete);
    setDisplayedPurposes(purposes);
  }, [purposes, isEditing, isAdding]);

  useEffect(() => {
    let filteredPurposes: Purpose[] = [];
    if (filter === "all") {
      filteredPurposes = purposes;
    } else if (filter === "completed") {
      filteredPurposes = completedPurposes;
    } else if (filter === "incomplete") {
      filteredPurposes = incompletePurposes;
    }
    // 表示される目的を設定
    setDisplayedPurposes(filteredPurposes);
  }, [filter, purposes, completedPurposes, incompletePurposes]);

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
  const newPurpose = (newPurpose) => {
    setPurposes([...purposes, newPurpose]);
    setIsEditing(true);
  };

  // TableShow コンポーネント内での更新処理
  const updatePurpose = (updatePurpose) => {
    const updatedPurposes = purposes.map((purpose) => {
      if (purpose.id === updatePurpose.id) {
        return updatePurpose; // 編集されたデータで該当の目的を更新
      }
      return purpose;
    });
    setPurposes(updatedPurposes); // 更新された purposes ステートを設定
    setIsAdding(true);
  };

  const deletePurpose = async (id: string) => {
    try {
      console.log(id);
      await Delete(id);
      setPurposes(purposes.filter((purpose) => purpose.id !== id)); // UIからも削除
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const deleteAllPurpose = async (ids: string[]) => {
    try {
      // 複数のIDに対して削除を実行
      await Promise.all(ids.map((id) => Delete(id)));
      // UIからも削除
      setPurposes(purposes.filter((purpose) => !ids.includes(purpose.id)));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const [orderBy, setOrderBy] =
    React.useState<keyof (typeof rows)[0]>("deadline");

  const [order, setOrder] = React.useState<{
    [key: string]: "asc" | "desc" | "default";
  }>({
    title: "default",
    result: "default",
    deadline: "asc",
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
  const sortedRows = displayedPurposes.slice().sort((a, b) => {
    const compare = (key: keyof (typeof rows)[0]) => {
      if (order[key] === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else if (order[key] === "desc") {
        return a[key] < b[key] ? 1 : -1;
      }
      return 0;
    };

    console.log(incompleteSelected.length);
    console.log(completedSelected.length);
    console.log(selected.length);

    return compare(orderBy);
  });

  const handleSelectAllClick = () => {
    if (filter === "incomplete") {
      if (incompleteSelected.length === incompletePurposes.length) {
        setIncompleteSelected([]);
        setSelected(selected.filter((id) => !incompleteSelected.includes(id)));
      } else {
        const allIds = incompletePurposes.map((purpose) => purpose.id);
        setIncompleteSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else if (filter === "completed") {
      if (completedSelected.length === completedPurposes.length) {
        setCompletedSelected([]);
        setSelected(selected.filter((id) => !completedSelected.includes(id)));
      } else {
        const allIds = completedPurposes.map((purpose) => purpose.id);
        setCompletedSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else {
      if (selected.length === purposes.length) {
        setCompletedSelected([]);
        setIncompleteSelected([]);
        setSelected([]);
      } else {
        const allIds = purposes.map((purpose) => purpose.id);
        const allCompletedIds = completedPurposes.map((purpose) => purpose.id);
        const allIncompleteIds = incompletePurposes.map(
          (purpose) => purpose.id
        );
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

  const handleColumnToggle = (property: keyof (typeof rows)[0]) => {
    setColumnSettings((prevSettings) => ({
      ...prevSettings,
      [property]: !prevSettings[property],
    }));
  };

  const visibleColumns = Object.fromEntries(
    Object.entries(columnSettings).filter(([key, value]) => value)
  );

  const handleDelete = (id) => {
    deletePurpose(id);
  };

  const handleAllDelete = () => {
    deleteAllPurpose(selected);
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
            <PurposeNew onAdd={newPurpose} onClose={handleNewCloseModal} />
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
            <MenuItem key={key} onClick={() => handleColumnToggle(key)}>
              <Checkbox checked={columnSettings[key]} />
              {columnNames[key]}
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
                    <Typography>{columnNames[key]}</Typography>

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
                onUpdate={updatePurpose}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
