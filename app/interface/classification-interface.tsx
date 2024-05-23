// Classificationの型定義
export type classificationData = {
  id: string;
  account_id: string;
  account_name: string;
  name: string;
  amount: number;
  classification_type: string;
};

export type classificationMonthlyAmountData = {
  id: string;
  classification_id: string;
  month: string;
  amount: number;
};

// ヘッダーに表示するClassificationの型定義
export type selectClassificationData = {
  name: string;
  account_name: string;
  amount: number;
};

// 列名を日本語に変換する辞書
export const columnClassificationNames = {
  name: "項目",
  account_name: "目標",
  amoun: "期限",
};

// Rowコンポーネントで使用する Props の型を定義
export interface classificationRowProps {
  row: classificationData; // row に Classification 型を適用
  onSelect: (id: string) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean }; // 適切な型を指定する必要があります
  onUpdate: (updatedClassification: classificationData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface classificationShowProps {
  id: string;
  account_id: string;
  account_name: string;
  name: string;
  amount: number;
  classification_type: string;
  onUpdate: (updatedClassification: classificationData) => void;
  onClose: () => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Newコンポーネントで使用する Props の型を定義
export interface classificationNewProps {
  onClassificationAdd: (newClassification: classificationData) => void;
  onClose: () => void;
  classification_type: string;
}
