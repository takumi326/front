import { displayPaymentData } from "@/interface/payment-interface";
import { displayAccountData } from "@/interface/account-interface";

export type incomeData = {
  id: string;
  category_id: string;
  category_name: string;
  classification_id: string;
  classification_name: string;
  amount: number;
  schedule: string;
  end_date: string;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: string[];
  body: string;
};

export type classificationNilIncomeData = {
  income_id: string;
  income_category_id: string;
  income_category_name: string;
  income_classification_id: string;
  income_classification_name: string;
  income_amount: number;
  income_schedule: string;
  income_end_date: string;
  income_repetition: boolean;
  income_repetition_type: string;
  income_repetition_settings: string[];
  income_body: string;
};

export type displayIncomeData = {
  id: string;
  classification_account_id: string;
  classification_account_name: string;
  classification_name: string;
  classification_date: string;
  classification_classification_type: string;
  history: {
    income_id: string;
    income_category_id: string;
    income_category_name: string;
    income_classification_id: string;
    income_classification_name: string;
    income_amount: number;
    income_schedule: string;
    income_end_date: string;
    income_repetition: boolean;
    income_repetition_type: string;
    income_repetition_settings: string[];
    income_body: string;
  }[];
};

export type selectIncomeData = {
  classification_name: string;
  classification_amount: number;
  classification_account_name: string;
};

export const columnIncomeNames = {
  classification_name: "分類",
  classification_amount: "合計金額",
  classification_account_name: "振込用口座",
};

export interface incomeRowProps {
  row: displayIncomeData;
  visibleColumns: { [key: string]: boolean };
}

export interface classificationNilIncomeRowProps {
  classificationNilRows: incomeData[];
  visibleColumns: { [key: string]: boolean };
}

export interface incomeShowProps {
  id: string;
  category_id: string;
  category_name: string;
  classification_id: string;
  classification_name: string;
  amount: number;
  schedule: string;
  end_date: string;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: string[];
  body: string;
  onClose: () => void;
  onIncomeDelete: (id: string, index: number) => void;
}

export interface incomeNewProps {
  onClose: () => void;
}
