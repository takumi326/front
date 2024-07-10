import React from "react";

interface AlertMessageProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  severity: "error" | "success" | "info" | "warning";
  message: string;
}



export const AlertMessage: React.FC<AlertMessageProps> = ({
  open,
  setOpen,
  severity,
  message,
}) => {
  // const handleCloseAlertMessage = (
  //   event?: React.SyntheticEvent,
  //   reason?: string
  // ) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setOpen(false);
  // };

  return (
    <>
      {open && (
        <div className={`alert ${severity}`} role="alert">
          <span>{message}</span>
        </div>
      )}
    </>
  );
};
