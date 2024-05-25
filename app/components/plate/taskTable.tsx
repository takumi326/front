"use client";
import React, { useState, useEffect, useContext } from "react";

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

import { taskGetData, taskDelete } from "@/lib/api/task-api";

import {
  taskData,
  columnTaskNames,
  selectTaskData,
} from "@/interface/task-interface";

import { taskContext } from "@/context/task-context";

import { TaskRow } from "@/components/task/row";
import { TaskNew } from "@/components/task/new";

export const TaskTable: React.FC = () => {
  const { tasks, setTasks, setAllTasks, currentMonth } =
    useContext(taskContext);

  const [completedTasks, setCompletedTasks] = useState<taskData[]>([]);
  const [incompleteTasks, setIncompleteTasks] = useState<taskData[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "incomplete"
  );
  const [displayedTasks, setDisplayedTasks] = useState<taskData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [completedSelected, setCompletedSelected] = useState<string[]>([]);
  const [incompleteSelected, setIncompleteSelected] = useState<string[]>([]);

  const [start, setStart] = useState<Date>(
    new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)) - 1,
      1
    )
  );
  const [end, setEnd] = useState<Date>(
    new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)),
      0,
      23,
      59
    )
  );

  const [orderBy, setOrderBy] =
    React.useState<keyof (typeof tasks)[0]>("schedule");

  const [order, setOrder] = React.useState<{
    [key: string]: "asc" | "desc" | "default";
  }>({
    title: "default",
    purpose_title: "default",
    schedule: "asc",
    repetition_type: "default",
    time: "default",
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [columnSettings, setColumnSettings] = useState<{
    [key: string]: boolean;
  }>(() => {
    if (tasks.length > 0) {
      const initialSettings: { [key: string]: boolean } = {};
      Object.keys(tasks[0]).forEach((key) => {
        initialSettings[key] = true;
      });
      return initialSettings;
    } else {
      // rows が空の場合は適切な初期設定を行う
      return {
        title: true,
        purpose_title: true,
        schedule: true,
        repetition_type: true,
        time: false,
      };
    }
  });

  useEffect(() => {
    const startScedule = new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)) - 1,
      1
    );
    const endScedule = new Date(
      Number(currentMonth.slice(0, 4)),
      Number(currentMonth.slice(4)),
      0
    );
    setStart(startScedule);
    setEnd(endScedule);
  }, [currentMonth]);

  useEffect(() => {
    taskGetData().then((data) => {
      setAllTasks(data);
    });
    taskGetData().then((datas) => {
      setTasks([]);
      if (start !== undefined && end !== undefined) {
        datas
          .filter(
            (data: taskData) =>
              new Date(data.schedule).getTime() >= start.getTime() &&
              new Date(data.schedule).getTime() <= end.getTime()
          )
          .map((data: taskData) => {
            setTasks((prevTasks) => [...prevTasks, data]);
          });
      } else {
        setTasks(datas);
      }
      setIsEditing(false);
    });
  }, [isEditing, currentMonth, start, end]);

  useEffect(() => {
    const completed = tasks.filter((task) => task.completed);
    const incomplete = tasks.filter((task) => !task.completed);
    setCompletedTasks(completed);
    setIncompleteTasks(incomplete);
    setDisplayedTasks(tasks);
  }, [tasks, isEditing]);

  useEffect(() => {
    let filteredTasks: taskData[] = [];
    if (filter === "all") {
      filteredTasks = tasks;
    } else if (filter === "completed") {
      filteredTasks = completedTasks;
    } else if (filter === "incomplete") {
      filteredTasks = incompleteTasks;
    }
    setDisplayedTasks(filteredTasks);
  }, [filter, tasks, completedTasks, incompleteTasks]);

  const handleFilterChange = (value: "all" | "completed" | "incomplete") => {
    setFilter(value);
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewModalOpen(false);
  };

  const editTask = () => {
    setIsEditing(true);
  };

  const deleteAllTask = async () => {
    try {
      await Promise.all(selected.map((id) => taskDelete(id)));
      setIsEditing(true);
      setCompletedSelected([]);
      setIncompleteSelected([]);
      setSelected([]);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleRequestSort = (property: keyof (typeof tasks)[0]) => {
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
  const sortedRows = displayedTasks.slice().sort((a, b) => {
    const compare = (key: keyof (typeof tasks)[0]) => {
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
      if (incompleteSelected.length === incompleteTasks.length) {
        setIncompleteSelected([]);
        setSelected(selected.filter((id) => !incompleteSelected.includes(id)));
      } else {
        const allIds = incompleteTasks.map((task) => task.id);
        setIncompleteSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else if (filter === "completed") {
      if (completedSelected.length === completedTasks.length) {
        setCompletedSelected([]);
        setSelected(selected.filter((id) => !completedSelected.includes(id)));
      } else {
        const allIds = completedTasks.map((task) => task.id);
        setCompletedSelected(allIds);
        setSelected([...selected, ...allIds]);
      }
    } else {
      if (selected.length === tasks.length) {
        setCompletedSelected([]);
        setIncompleteSelected([]);
        setSelected([]);
      } else {
        const allIds = tasks.map((task) => task.id);
        const allCompletedIds = completedTasks.map((task) => task.id);
        const allIncompleteIds = incompleteTasks.map((task) => task.id);
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

  const handleColumnToggle = (property: keyof selectTaskData) => {
    setColumnSettings((prevSettings) => ({
      ...prevSettings,
      [property]: !prevSettings[property],
    }));
  };

  const visibleColumns = Object.fromEntries(
    Object.entries(columnSettings).filter(([key, value]) => value)
  );

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
            <TaskNew onAdd={editTask} onClose={handleCloseModal} />
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
            <DeleteIcon onClick={deleteAllTask} />
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
        {tasks.length > 0 &&
          Object.keys(tasks[0]).map((key) =>
            columnTaskNames[key as keyof selectTaskData] ? (
              <MenuItem
                key={key}
                onClick={() => handleColumnToggle(key as keyof selectTaskData)}
              >
                <Checkbox checked={columnSettings[key]} />
                {columnTaskNames[key as keyof selectTaskData]}
              </MenuItem>
            ) : null
          )}
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
                          tasks.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length <
                          tasks.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 && selected.length < tasks.length
                      : false
                  }
                  checked={
                    filter === "incomplete"
                      ? incompleteSelected.length > 0 &&
                        incompleteSelected.length ===
                          tasks.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length ===
                          tasks.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 && selected.length === tasks.length
                      : false
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {Object.keys(visibleColumns).map((key) => (
                <TableCell key={key}>
                  <Stack direction="row" alignItems="center">
                    <Typography>
                      {columnTaskNames[key as keyof selectTaskData]}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        handleRequestSort(key as keyof (typeof tasks)[0])
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
              <TaskRow
                key={row.title}
                row={row}
                onSelect={handleSelect}
                isSelected={isSelected(row.id, row.completed)}
                visibleColumns={visibleColumns}
                onUpdate={editTask}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
