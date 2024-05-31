export type categoryData = {
  id: string;
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
}

export interface categoryNewProps {
  onClose: () => void;
  category_type: string;
}
