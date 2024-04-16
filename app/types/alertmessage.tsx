export interface AlertMessageProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  severity: "error" | "success" | "info" | "warning";
  message: string;
}

