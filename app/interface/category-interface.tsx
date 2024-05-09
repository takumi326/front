// Classificationの型定義
export type categoryData = {
  id: string;
  name: string;
  category_type: string;
};

// ヘッダーに表示するClassificationの型定義
export type selectClassificationData = {
  name: string;
  category_type: string;
};

// 列名を日本語に変換する辞書
export const columnClassificationNames = {
  name: "項目",
  category_type: "目標",
};

// Rowコンポーネントで使用する Props の型を定義
export interface categoryRowProps {
  row: categoryData; // row に Classification 型を適用
  onSelect: (id: string) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean }; // 適切な型を指定する必要があります
  onUpdate: (updatedClassification: categoryData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface categoryShowProps {
  id: string;
  name: string;
  category_type: string;
  onUpdate: (updatedClassification: categoryData) => void;
  onClose: () => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Newコンポーネントで使用する Props の型を定義
export interface categoryNewProps {
  onAdd: (newClassification: categoryData) => void;
  onClose: () => void;
}
