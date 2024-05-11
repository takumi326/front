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
export type displayPaymentData = {
  classification_name: string;
  classification_amount: number;
  clsasfication_account: string;
  history: {
    payment_schedule: Date;
    payment_category_name: string;
    payment_amount: number;
    payment_repetition_type: string;
  }[];
};

export type selectPaymentData = {
  classification_name: string;
  classification_amount: number;
  clsasfication_account: string;
};

// 列名を日本語に変換する辞書
export const columnPaymentNames = {
  classification_name: "分類",
  classification_amount: "合計金額",
  clsasfication_account: "支払い口座",
  history: {
    payment_schedule: "日付",
    payment_category_name: "カテゴリ",
    payment_amount: "金額",
    payment_repetition_type: "繰り返し",
  },
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
