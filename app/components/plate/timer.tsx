"use client";
import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";

export const TimerView: React.FC = () => {
  const [time, setTime] = useState(0); // タイマーの秒数を保持
  const [isRunning, setIsRunning] = useState(false); // タイマーの状態を保持

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <Paper>
      <Box p={2} textAlign="center">
        <Typography variant="h4">
          {new Date(time * 1000).toISOString().substr(11, 8)}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleStart} disabled={isRunning}>
            Start
          </Button>
          <Button variant="contained" color="secondary" onClick={handleStop} disabled={!isRunning}>
            Stop
          </Button>
          <Button variant="contained" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
