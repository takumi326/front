// Taskの型定義
export type accountData = {
  id: string;
  name: string;
  amount: number;
  body: string;
};

export type displayAccountData = {
  id: string;
  account_name: string;
  account_amount: number;
  account_body: string;
  history: {
    transfer_id: string;
    transfer_before_account_id: string;
    transfer_before_account_name: string;
    transfer_after_account_id: string;
    transfer_amount: number;
    transfer_schedule: Date;
    transfer_repetition: boolean;
    transfer_repetition_type: string;
    transfer_repetition_settings: [];
    transfer_body: string;
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
};

// Rowコンポーネントで使用する Props の型を定義
export interface accountRowProps {
  row: displayAccountData;
  onSelect: (id: string) => void;
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onUpdate: (updatedAccount: accountData) => void;
  onDelete: (id: string) => void;
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
