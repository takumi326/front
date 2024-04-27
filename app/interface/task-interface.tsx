// 列名を日本語に変換する辞書
export const columnNames = {
  title: "項目",
  result: "目標",
  deadline: "期限",
};

// コンポーネントで使用する Props の型を定義
export interface componentProps {
  row: purposeDate; // row に Purpose 型を適用
  onSelect: (id: string, completed: boolean) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: any[]; // 適切な型を指定する必要があります
  onDelete: (id: string) => void; // onDelete の型を指定
  onEdit: (purpose: purposeDate) => void; // onEdit の型を指定
}

// Purposeの型定義
export type purposeDate = {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
};
