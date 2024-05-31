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

import { purposeGetData, purposeDelete } from "@/lib/api/purpose-api";

import {
  purposeData,
  columnPurposeNames,
  selectPurposeData,
} from "@/interface/purpose-interface";

import { purposeContext } from "@/context/purpose-context";

import { PurposeRow } from "@/components/purpose/row";
import { PurposeNew } from "@/components/purpose/new";

export const PurposeTable: React.FC = () => {
  const { purposes, setPurposes, isEditing, setIsEditing } =
    useContext(purposeContext);

  const [completedPurposes, setCompletedPurposes] = useState<purposeData[]>([]);
  const [incompletePurposes, setIncompletePurposes] = useState<purposeData[]>(
    []
  );
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "incomplete"
  );
  const [displayedPurposes, setDisplayedPurposes] = useState<purposeData[]>([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [completedSelected, setCompletedSelected] = useState<string[]>([]);
  const [incompleteSelected, setIncompleteSelected] = useState<string[]>([]);

  const [orderBy, setOrderBy] =
    React.useState<keyof (typeof purposes)[0]>("deadline");

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
    if (purposes.length > 0) {
      const initialSettings: { [key: string]: boolean } = {};
      Object.keys(purposes[0]).forEach((key) => {
        initialSettings[key] = true;
      });
      return initialSettings;
    } else {
      return {
        title: true,
        result: true,
        deadline: true,
      };
    }
  });

  useEffect(() => {
    purposeGetData().then((data) => {
      setPurposes(data);
    });
    setIsEditing(false);
  }, [isEditing]);

  useEffect(() => {
    const completed = purposes.filter((purpose) => purpose.completed);
    const incomplete = purposes.filter((purpose) => !purpose.completed);
    setCompletedPurposes(completed);
    setIncompletePurposes(incomplete);
    setDisplayedPurposes(purposes);
  }, [purposes, isEditing]);

  useEffect(() => {
    let filteredPurposes: purposeData[] = [];
    if (filter === "all") {
      filteredPurposes = purposes;
    } else if (filter === "completed") {
      filteredPurposes = completedPurposes;
    } else if (filter === "incomplete") {
      filteredPurposes = incompletePurposes;
    }
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

  const deleteAllPurpose = async () => {
    try {
      await Promise.all(selected.map((id) => purposeDelete(id)));
      setIsEditing(true);
      setCompletedSelected([]);
      setIncompleteSelected([]);
      setSelected([]);
    } catch (error) {
      console.error("Failed to delete purpose:", error);
    }
  };

  const handleRequestSort = (property: keyof (typeof purposes)[0]) => {
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

  const sortedRows = displayedPurposes.slice().sort((a, b) => {
    const compare = (key: keyof (typeof purposes)[0]) => {
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

  const handleClose = () => setAnchorEl(null);

  const handleColumnToggle = (property: keyof selectPurposeData) => {
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
            <PurposeNew onClose={handleCloseModal} />
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
            <DeleteIcon onClick={deleteAllPurpose} />
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
        {purposes.length > 0 &&
          Object.keys(purposes[0]).map((key) =>
            columnPurposeNames[key as keyof selectPurposeData] ? (
              <MenuItem
                key={key}
                onClick={() =>
                  handleColumnToggle(key as keyof selectPurposeData)
                }
              >
                <Checkbox checked={columnSettings[key]} />
                {columnPurposeNames[key as keyof selectPurposeData]}
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
                          purposes.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length <
                          purposes.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 && selected.length < purposes.length
                      : false
                  }
                  checked={
                    filter === "incomplete"
                      ? incompleteSelected.length > 0 &&
                        incompleteSelected.length ===
                          purposes.filter((row) => !row.completed).length
                      : filter === "completed"
                      ? completedSelected.length > 0 &&
                        completedSelected.length ===
                          purposes.filter((row) => row.completed).length
                      : filter === "all"
                      ? selected.length > 0 &&
                        selected.length === purposes.length
                      : false
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {Object.keys(visibleColumns).map((key) => (
                <TableCell key={key}>
                  <Stack direction="row" alignItems="center">
                    <Typography>
                      {columnPurposeNames[key as keyof selectPurposeData]}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        handleRequestSort(key as keyof (typeof purposes)[0])
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
              <PurposeRow
                key={row.title}
                row={row}
                onSelect={handleSelect}
                isSelected={isSelected(row.id, row.completed)}
                visibleColumns={visibleColumns}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
