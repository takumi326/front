export type taskData = {
  id: string;
  title: string;
  purpose_id: string;
  purpose_title: string;
  schedule: string;
  end_date: string;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: string[];
  body: string;
  completed: boolean;
};

export type completedRepetitionTaskData = {
  id: string;
  task_id: string;
  completed_date: string;
  completed: boolean;
};

export type selectTaskData = {
  title: string;
  purpose_title: string;
  schedule: string;
  repetition_type: string;
};

export const columnTaskNames = {
  title: "項目",
  purpose_title: "関連する目標",
  schedule: "予定",
  repetition_type: "繰り返し",
};

export interface taskRowProps {
  row: taskData;
  onSelect: (id: string, completed: boolean) => void;
  isSelected: boolean;
  visibleColumns: { [key: string]: boolean };
}

export interface taskShowProps {
  id: string;
  title: string;
  purpose_id: string;
  schedule: string;
  end_date: string;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: string[];
  body: string;
  completed: boolean;
  onClose: () => void;
}

export interface taskNewProps {
  onClose: () => void;
}
