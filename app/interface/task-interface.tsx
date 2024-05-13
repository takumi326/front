// Taskの型定義
export type taskData = {
  id: string;
  title: string;
  purpose_id: string;
  purpose_title: string;
  schedule: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
  completed: boolean;
};

// ヘッダーに表示するTaskの型定義
export type selectTaskData = {
  title: string;
  purpose_title: string;
  schedule: Date;
  repetition_type: string;
};

// 列名を日本語に変換する辞書
export const columnTaskNames = {
  title: "項目",
  purpose_title: "関連する目標",
  schedule: "予定",
  repetition_type: "繰り返し",
};

// Rowコンポーネントで使用する Props の型を定義
export interface taskRowProps {
  row: taskData; // row に Task 型を適用
  onSelect: (id: string, completed: boolean) => void; // onSelect の型を指定
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
  onUpdate: (updatedTask: taskData) => void;
  onDelete: (id: string) => void; // onDelete の型を指定
}

// Showコンポーネントで使用する Props の型を定義
export interface taskShowProps {
  id: string;
  title: string;
  purpose_id: string;
  purpose_title: string;
  schedule: Date;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: [];
  body: string;
  completed: boolean;
  onUpdate: (updatedTask: taskData) => void;
  onClose: () => void;
  onDelete: (id: string) => void; 
}

// Newコンポーネントで使用する Props の型を定義
export interface taskNewProps {
  onAdd: (newTask: taskData) => void;
  onClose: () => void;
}
