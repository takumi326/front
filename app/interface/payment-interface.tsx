// Taskの型定義
export type paymentData = {
  id: string;
  category_id: string;
  category_name: string;
  classification_id: string;
  classification_name: string;
  amount: number;
  schedule: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
};

// ヘッダーに表示するTaskの型定義
export type selectPaymentData = {
  schedule: Date;
  category_name: string;
  amount: number;
  repetition_type: string;
};

// 列名を日本語に変換する辞書
export const columnPaymentNames = {
  schedule: "予定",
  category_name: "カテゴリ",
  amount: "金額",
  repetition_type: "繰り返し",
};

// Rowコンポーネントで使用する Props の型を定義
export interface paymentRowProps {
  row: paymentData; // row に Task 型を適用
  onSelect: (id: string) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onUpdate: (updatedPayment: paymentData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface paymentShowProps {
  id: string;
  category_id: string;
  category_name: string;
  classification_id: string;
  classification_name: string;
  amount: number;
  schedule: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
  onUpdate: (updatedPayment: paymentData) => void;
  onClose: () => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface paymentNewProps {
  onAdd: (newPayment: paymentData) => void;
  onClose: () => void;
}
