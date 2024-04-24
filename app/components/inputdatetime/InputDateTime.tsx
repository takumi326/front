import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";

export const InputDateTime: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
}> = ({ selectedDate, onChange }) => {
  registerLocale("ja", ja);
  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date | undefined) => onChange(date)}
      dateFormat="MM/dd/yy "
      timeCaption="Time"
      placeholderText="いつか"
      locale="ja"
    />
  );
};
