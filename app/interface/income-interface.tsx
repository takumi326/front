// Incomeの型定義
export type incomeData = {
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

// ヘッダーに表示するIncomeの型定義
export type displayIncomeData = {
  classification_name: string;
  classification_amount: number;
  clsasfication_account: string;
  history: {
    income_schedule: Date;
    income_category_name: string;
    income_amount: number;
    income_repetition_type: string;
  }[];
};

export type selectIncomeData = {
  classification_name: string;
  classification_amount: number;
  clsasfication_account: string;
};

// 列名を日本語に変換する辞書
export const columnIncomeNames = {
  classification_name: "分類",
  classification_amount: "合計金額",
  clsasfication_account: "支払い口座",
  history: {
    income_schedule: "日付",
    income_category_name: "カテゴリ",
    income_amount: "金額",
    income_repetition_type: "繰り返し",
  },
};

// Rowコンポーネントで使用する Props の型を定義
export interface incomeRowProps {
  row: incomeData; // row に Income 型を適用
  onSelect: (id: string) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onUpdate: (updatedIncome: incomeData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface incomeShowProps {
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
  onUpdate: (updatedIncome: incomeData) => void;
  onClose: () => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface incomeNewProps {
  onAdd: (newIncome: incomeData) => void;
  onClose: () => void;
}
