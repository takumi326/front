export type repetitionMoneyData = {
  id: string;
  transaction_type: string;
  payment_id: string;
  income_id: string;
  transfer_id: string;
  amount: number;
  repetition_schedule: string;
};

export interface repetitionMoneyRowProps {
  id: string;
  amount: number;
  repetition_schedule: string;
  limitAmount: number;
  onChange: (id: string, amount: number, date: string) => void;
  onDelete: (id: string) => void;
}
