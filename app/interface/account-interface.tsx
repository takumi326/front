// Taskの型定義
export type accountData = {
  id: string;
  name: string;
  amount: number;
  body: string;
};

export type displayAccountData = {
  account_name: string;
  account_amount: number;
  history: {
    transfer_schedule: Date;
    transfer_before_account_name: string;
    transfer_amount: number;
    transfer_repetition_type: string;
  }[];
};

export type selectAccountData = {
  account_name: string;
  account_amount: number;
};


// 列名を日本語に変換する辞書
export const columnAccountNames = {
  account_name: "口座名",
  account_amount: "金額",
  history: {
    transfer_schedule: "日付",
    transfer_before_account_name: "入金された口座",
    transfer_amount: "金額",
    transfer_repetition_type: "繰り返し",
  },
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
