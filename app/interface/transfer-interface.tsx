export type transferData = {
  id: string;
  before_account_id: string;
  after_account_id: string;
  after_account_name: string;
  amount: number;
  schedule: string;
  end_date: string;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: string[];
  body: string;
};

export interface transferShowProps {
  id: string;
  before_account_id: string;
  after_account_id: string;
  after_account_name: string;
  amount: number;
  schedule: string;
  end_date: string;
  repetition: boolean;
  repetition_type: string;
  repetition_settings: string[];
  body: string;
  onClose: () => void;
}

export interface transferNewProps {
  onClose: () => void;
}
