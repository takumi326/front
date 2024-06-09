export type accountData = {
  id: string;
  name: string;
  amount: number;
  body: string;
};

export type accountOrderByType =
  | "id"
  | "account_name"
  | "account_amount"
  | "account_body";


export type displayAccountData = {
  id: string;
  account_name: string;
  account_amount: number;
  account_body: string;
  history: {
    transfer_id: string;
    transfer_before_account_id: string;
    transfer_after_account_id: string;
    transfer_after_account_name: string;
    transfer_amount: number;
    transfer_schedule: string;
    transfer_end_date: string;
    transfer_repetition: boolean;
    transfer_repetition_type: string;
    transfer_repetition_settings: string[];
    transfer_body: string;
  }[];
};

export type selectAccountData = {
  account_name: string;
  account_amount: number;
};

export const columnAccountNames = {
  account_name: "口座名",
  account_amount: "金額",
};

export interface accountRowProps {
  row: displayAccountData;
  visibleColumns: { [key: string]: boolean };
}

export interface accountShowProps {
  id: string;
  name: string;
  amount: number;
  body: string;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export interface accountNewProps {
  onClose: () => void;
}
