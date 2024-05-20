// Taskの型定義
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

export type classificationNilIncomeData = {
  income_id: string;
  income_category_id: string;
  income_category_name: string;
  income_classification_id: string;
  income_classification_name: string;
  income_amount: number;
  income_schedule: Date;
  income_repetition: boolean;
  income_repetition_type: string;
  income_repetition_settings: [];
  income_body: string;
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

export type displayIncomeData = {
  id: string;
  classification_account_id: string;
  classification_account_name: string;
  classification_name: string;
  classification_amount: number;
  classification_classification_type: string;
  history: {
    income_id: string;
    income_category_id: string;
    income_category_name: string;
    income_classification_id: string;
    income_classification_name: string;
    income_amount: number;
    income_schedule: Date;
    income_repetition: boolean;
    income_repetition_type: string;
    income_repetition_settings: [];
    income_body: string;
  }[];
};

export type selectIncomeData = {
  classification_name: string;
  classification_amount: number;
  classification_account_name: string;
};

// 列名を日本語に変換する辞書
export const columnIncomeNames = {
  classification_name: "分類",
  classification_amount: "合計金額",
  classification_account_name: "支払い口座",
};

// Rowコンポーネントで使用する Props の型を定義
export interface incomeRowProps {
  row: displayIncomeData;
  // onSelect: (id: string) => void;
  // isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onIncomeUpdate: (updatedIncome: incomeData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onIncomeDelete: (id: string) => void;
  onClassificationDelete: (id: string) => void;
}

// Rowコンポーネントで使用する Props の型を定義
export interface classificationNilIncomeRowProps {
  classificationNilRows: incomeData[];
  // onSelect: (id: string) => void;
  // isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onIncomeUpdate: (updatedIncome: incomeData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onIncomeDelete: (id: string) => void;
  onClassificationDelete: (id: string) => void;
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
  onIncomeUpdate: (updatedIncome: incomeData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onClose: () => void;
  onIncomeDelete: (id: string, index: number) => void;
}

// Newコンポーネントで使用する Props の型を定義
export interface incomeNewProps {
  onIncomeAdd: (newIncome: incomeData) => void;
  onClassificationUpdate: (updatedClassification: classificationData) => void;
  onCategoryUpdate: (updatedCategory: categoryData) => void;
  onClose: () => void;
}
