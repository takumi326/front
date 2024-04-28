// 列名を日本語に変換する辞書
export const columnTaskNames = {
  title: "項目",
  result: "目標",
  deadline: "期限",
};

// Rowコンポーネントで使用する Props の型を定義
export interface purposeRowProps {
  row: taskDate; // row に Purpose 型を適用
  onSelect: (id: string, completed: boolean) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean }; // 適切な型を指定する必要があります
  onUpdate: (updatedPurpose: taskDate) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface taskShowProps {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
  onUpdate: (updatedPurpose: taskDate) => void;
  onClose: () => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface taskNewProps {
  onAdd: (newPurpose: taskDate) => void;
  onClose: () => void;
}

// Purposeの型定義
export type taskDate = {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
};

// Purposeの型定義
export type selectTaskDate = {
  title: string;
  result: string;
  deadline: Date;
};
