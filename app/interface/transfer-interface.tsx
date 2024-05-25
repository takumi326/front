// Taskの型定義
export type transferData = {
  id: string;
  before_account_id: string;
  after_account_id: string;
  after_account_name: string;
  amount: number;
  schedule: Date;
  end_date: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
};

// ヘッダーに表示するTaskの型定義
export type selectTransferData = {
  before_account_name: string;
  amount: number;
  schedule: Date;
  repetition_type: string;
};

// 列名を日本語に変換する辞書
export const columnTransferNames = {
  before_account_name: "口座名",
  amount: "金額",
  schedule: "予定",
  repetition_type: "繰り返し",
};

// Rowコンポーネントで使用する Props の型を定義
export interface transferRowProps {
  row: transferData; // row に Task 型を適用
  onSelect: (id: string) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onUpdate: (updatedTransfer: transferData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface transferShowProps {
  id: string;
  before_account_id: string;
  before_account_name: string;
  after_account_id: string;
  after_account_name: string;
  amount: number;
  schedule: Date;
  end_date: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
  onUpdate: (updatedTransfer: transferData) => void;
  onClose: () => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface transferNewProps {
  onAdd: (newTransfer: transferData) => void;
  onClose: () => void;
}
