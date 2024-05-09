// Taskの型定義
export type accountData = {
  id: string;
  name: string;
  amount: number;
  body: string;
};

// ヘッダーに表示するTaskの型定義
export type selectAccountData = {
  name: string;
  amount: number;
};

// 列名を日本語に変換する辞書
export const columnAccountNames = {
  name: "口座名",
  amount: "金額",
};

// Rowコンポーネントで使用する Props の型を定義
export interface accountRowProps {
  row: accountData; // row に Task 型を適用
  onSelect: (id: string) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onUpdate: (updatedAccount: accountData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface accountShowProps {
  id: string;
  name: string;
  amount: number;
  body: string;
  onUpdate: (updatedAccount: accountData) => void;
  onClose: () => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface accountNewProps {
  onAdd: (newAccount: accountData) => void;
  onClose: () => void;
}
