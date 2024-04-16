import React from "react";
import { AlertMessageProps } from "@/types/alertmessage";

export const AlertMessage: React.FC<AlertMessageProps> = ({
  open,
  setOpen,
  severity,
  message,
}) => {
  const handleCloseAlertMessage = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className={`alert ${severity}`} role="alert">
          <span>{message}</span>
          <button onClick={handleCloseAlertMessage}>Close</button>
        </div>
      )}
    </>
  );
};
