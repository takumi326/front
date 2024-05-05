import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";

export const InputDateTime: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
}> = ({ selectedDate, onChange }) => {
  registerLocale("ja", ja);

  // selectedDateの時間部分を0時00分に設定
  const resetTime = (date: Date | null | undefined) => {
    const datetype = new Date(date);
    return new Date(
      datetype.getFullYear(),
      datetype.getMonth(),
      datetype.getDate(),
      0,
      0,
      0
    );
  };

  return (
    <DatePicker
      selected={resetTime(selectedDate)}
      onChange={(date: Date) => onChange(date)}
      dateFormat="MM/dd/yy "
      timeCaption="Time"
      locale="ja"
    />
  );
};
