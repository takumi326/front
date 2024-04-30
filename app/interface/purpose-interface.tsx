// Purposeの型定義
export type purposeData = {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
};

// ヘッダーに表示するPurposeの型定義
export type selectPurposeData = {
  title: string;
  result: string;
  deadline: Date;
};

// 列名を日本語に変換する辞書
export const columnPurposeNames = {
  title: "項目",
  result: "目標",
  deadline: "期限",
};


// Rowコンポーネントで使用する Props の型を定義
export interface purposeRowProps {
  row: purposeData; // row に Purpose 型を適用
  onSelect: (id: string, completed: boolean) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean }; // 適切な型を指定する必要があります
  onUpdate: (updatedPurpose: purposeData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface purposeShowProps {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
  onUpdate: (updatedPurpose: purposeData) => void;
  onClose: () => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface purposeNewProps {
  onAdd: (newPurpose: purposeData) => void;
  onClose: () => void;
}
