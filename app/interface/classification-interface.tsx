export type classificationData = {
  id: string;
  account_id: string;
  account_name: string;
  name: string;
  classification_type: string;
};

export type classificationMonthlyAmountData = {
  id: string;
  classification_id: string;
  month: string;
  date: string;
  amount: number;
};

export type selectClassificationData = {
  name: string;
  account_name: string;
  amount: number;
};

export interface classificationRowProps {
  row: classificationData;
  onSelect: (id: string) => void;
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
}

export interface classificationShowProps {
  id: string;
  account_id: string;
  account_name: string;
  name: string;
  classification_type: string;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export interface classificationNewProps {
  onClose: () => void;
  classification_type: string;
}
