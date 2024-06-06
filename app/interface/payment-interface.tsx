export type paymentData = {
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

export type classificationNilPaymentData = {
  payment_id: string;
  payment_category_id: string;
  payment_category_name: string;
  payment_classification_id: string;
  payment_classification_name: string;
  payment_amount: number;
  payment_schedule: string;
  payment_end_date: string;
  payment_repetition: boolean;
  payment_repetition_type: string;
  payment_repetition_settings: string[];
  payment_body: string;
};

export type displayPaymentData = {
  id: string;
  classification_account_id: string;
  classification_account_name: string;
  classification_name: string;
  classification_classification_type: string;
  history: {
    payment_id: string;
    payment_category_id: string;
    payment_category_name: string;
    payment_classification_id: string;
    payment_classification_name: string;
    payment_amount: number;
    payment_schedule: string;
    payment_end_date: string;
    payment_repetition: boolean;
    payment_repetition_type: string;
    payment_repetition_settings: string[];
    payment_body: string;
  }[];
};

export type selectPaymentData = {
  classification_name: string;
  classification_amount: number;
  classification_account_name: string;
};

export const columnPaymentNames = {
  classification_name: "分類",
  classification_amount: "合計金額",
  classification_account_name: "支払い口座",
  classification_date: "支払い日時",
};

export interface paymentRowProps {
  row: displayPaymentData;
  start: Date;
  end: Date;
  visibleColumns: { [key: string]: boolean };
}

export interface classificationNilPaymentRowProps {
  classificationNilRows: paymentData[];
  visibleColumns: { [key: string]: boolean };
}

export interface paymentShowProps {
  id: string;
  category_id: string;
  classification_id: string;
  amount: number;
  schedule: string;
  end_date: string;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: string[];
  body: string;
  onClose: () => void;
}

export interface paymentNewProps {
  onClose: () => void;
}
