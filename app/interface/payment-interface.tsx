// Taskの型定義
export type paymentData = {
  id: string;
  category_id: string;
  category_name: string;
  classification_id: string;
  classification_name: string;
  amount: number;
  schedule: Date;
  end_date: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
};

export type classificationNilPaymentData = {
  payment_id: string;
  payment_category_id: string;
  payment_category_name: string;
  payment_classification_id: string;
  payment_classification_name: string;
  payment_amount: number;
  payment_schedule: Date;
  payment_end_date: Date;
  payment_repetition: boolean;
  payment_repetition_type: string;
  payment_repetition_settings: [];
  payment_body: string;
};

export type classificationData = {
  id: string;
  account_id: string;
  account_name: string;
  name: string;
  amount: number;
  classification_type: string;
};

export type categoryData = {
  id: string;
  name: string;
  category_type: string;
};

export type displayPaymentData = {
  id: string;
  classification_account_id: string;
  classification_account_name: string;
  classification_name: string;
  classification_amount: number;
  classification_classification_type: string;
  history: {
    payment_id: string;
    payment_category_id: string;
    payment_category_name: string;
    payment_classification_id: string;
    payment_classification_name: string;
    payment_amount: number;
    payment_schedule: Date;
    payment_end_date: Date;
    payment_repetition: boolean;
    payment_repetition_type: string;
    payment_repetition_settings: [];
    payment_body: string;
  }[];
};

export type selectPaymentData = {
  classification_name: string;
  classification_amount: number;
  classification_account_name: string;
};

// 列名を日本語に変換する辞書
export const columnPaymentNames = {
  classification_name: "分類",
  classification_amount: "合計金額",
  classification_account_name: "支払い口座",
};

// Rowコンポーネントで使用する Props の型を定義
export interface paymentRowProps {
  row: displayPaymentData;
  // onSelect: (id: string) => void;
  // isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onPaymentUpdate: (updatedPayment: paymentData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onPaymentDelete: (id: string) => void;
  onClassificationDelete: (id: string) => void;
}

// Rowコンポーネントで使用する Props の型を定義
export interface classificationNilPaymentRowProps {
  classificationNilRows: paymentData[];
  // onSelect: (id: string) => void;
  // isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onPaymentUpdate: (updatedPayment: paymentData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onPaymentDelete: (id: string) => void;
  onClassificationDelete: (id: string) => void;
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
  end_date: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
  onPaymentUpdate: (updatedPayment: paymentData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onClose: () => void;
  onPaymentDelete: (id: string, index: number) => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface paymentNewProps {
  onPaymentAdd: (newPayment: paymentData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onCategoryUpdate: (updatedCategory: categoryData) => void;
  onClose: () => void;
}
