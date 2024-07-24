"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

import { taskGetData, taskDelete } from "@/lib/api/task-api";
import {
  completedRepetitionTaskGetData,
  completedRepetitionTaskDelete,
} from "@/lib/api/completedRepetitionTask-api";

import {
  taskData,
  completedRepetitionTaskData,
  columnTaskNames,
  selectTaskData,
} from "@/interface/task-interface";

import { taskContext } from "@/context/task-context";

export const TimerView: React.FC = () => {
  const {
    tableTasks,
    setTableTasks,
    setCalendarTasks,
    allTasks,
    setAllTasks,
    completedRepetitionTasks,
    setCompletedRepetitionTasks,
    currentMonth,
    isEditing,
    setIsEditing,
  } = useContext(taskContext);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false); 
  const timerRef = useRef<NodeJS.Timeout | null>(null); 

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, time]);

  useEffect(() => {
    const handleAllDataFetch = async () => {
      await taskGetData().then((taskDatas) => {
        const allTasks: Array<taskData> = [];
        completedRepetitionTaskGetData().then(
          (completedRepetitionTaskDatas) => {
            taskDatas.forEach((taskData: taskData) => {
              if (taskData.repetition === true) {
                completedRepetitionTaskDatas
                  .filter(
                    (completedRepetitionTask: completedRepetitionTaskData) =>
                      completedRepetitionTask.task_id === taskData.id
                  )
                  .forEach(
                    (completedRepetitionTask: completedRepetitionTaskData) => {
                      const repetitionTaskData = {
                        id: taskData.id,
                        title: taskData.title,
                        purpose_id: taskData.purpose_id,
                        purpose_title: taskData.purpose_title,
                        schedule: completedRepetitionTask.completed_date,
                        end_date: taskData.end_date,
                        repetition: taskData.repetition,
                        repetition_type: taskData.repetition_type,
                        repetition_settings: taskData.repetition_settings,
                        body: taskData.body,
                        completed: completedRepetitionTask.completed,
                      };
                      allTasks.push(repetitionTaskData);
                    }
                  );
              } else {
                allTasks.push(taskData);
              }
            });
            setCalendarTasks(allTasks);
          }
        );
      });

      //   await taskGetData().then((taskDatas) => {
      //     const allTasks: Array<taskData> = [];
      //     completedRepetitionTaskGetData().then(
      //       (completedRepetitionTaskDatas) => {
      //         taskDatas.forEach((taskData: taskData) => {
      //           if (taskData.repetition === true) {
      //             completedRepetitionTaskDatas
      //               .filter(
      //                 (completedRepetitionTask: completedRepetitionTaskData) =>
      //                   completedRepetitionTask.task_id === taskData.id &&
      //                   new Date(
      //                     completedRepetitionTask.completed_date
      //                   ).getTime() >= start.getTime() &&
      //                   new Date(
      //                     completedRepetitionTask.completed_date
      //                   ).getTime() <= end.getTime()
      //               )
      //               .forEach(
      //                 (completedRepetitionTask: completedRepetitionTaskData) => {
      //                   const repetitionTaskData = {
      //                     id: completedRepetitionTask.id,
      //                     title: taskData.title,
      //                     purpose_id: taskData.purpose_id,
      //                     purpose_title: taskData.purpose_title,
      //                     schedule: completedRepetitionTask.completed_date,
      //                     end_date: taskData.end_date,
      //                     repetition: taskData.repetition,
      //                     repetition_type: taskData.repetition_type,
      //                     repetition_settings: taskData.repetition_settings,
      //                     body: taskData.body,
      //                     completed: completedRepetitionTask.completed,
      //                   };
      //                   allTasks.push(repetitionTaskData);
      //                 }
      //               );
      //           } else {
      //             if (
      //               new Date(taskData.schedule).getTime() >= start.getTime() &&
      //               new Date(taskData.schedule).getTime() <= end.getTime()
      //             ) {
      //               allTasks.push(taskData);
      //             }
      //           }
      //         });
      //         setTableTasks(allTasks);
      //       }
      //     );
      //   });
      setIsEditing(false);
    };

    handleAllDataFetch();
  }, [isEditing]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <Paper>
      <Box p={2} textAlign="center">
        <Typography variant="h4">
          {new Date(time * 1000).toISOString().substr(11, 8)}
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStart}
            disabled={isRunning}
          >
            Start
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStop}
            disabled={!isRunning}
          >
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
