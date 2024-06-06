export type categoryData = {
  id: string;
  user_id: string;
  name: string;
  category_type: string;
};

export type selectClassificationData = {
  name: string;
  category_type: string;
};

export const columnClassificationNames = {
  name: "項目",
  category_type: "目標",
};

export interface categoryRowProps {
  category: categoryData;
  category_type: string;
}

export interface categoryShowProps {
  id: string;
  name: string;
  category_type: string;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export interface categoryNewProps {
  category_type: string;
  onClose: () => void;
}
