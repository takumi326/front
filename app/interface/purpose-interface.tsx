export type purposeData = {
  id: string;
  title: string;
  result: string;
  deadline: string;
  body: string;
  completed: boolean;
};

export type selectPurposeData = {
  title: string;
  result: string;
  deadline: string;
};

export const columnPurposeNames = {
  title: "項目",
  result: "目標",
  deadline: "期限",
};

export interface purposeRowProps {
  row: purposeData; 
  onSelect: (id: string, completed: boolean) => void; 
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean }; 
  onUpdate: () => void;
}

export interface purposeShowProps {
  id: string;
  title: string;
  result: string;
  deadline: string;
  body: string;
  completed: boolean;
  onUpdate: () => void;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export interface purposeNewProps {
  onAdd: () => void;
  onClose: () => void;
}
