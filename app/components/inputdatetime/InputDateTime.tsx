"use client";
import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";

export const InputDateTime: React.FC<{
  selectedDate: string;
  onChange: (date: Date) => void;
}> = ({ selectedDate, onChange }) => {
  registerLocale("ja", ja);

  // selectedDateの時間部分を0時00分に設定
  const resetTime = (date: string) => {
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

  const [isYearMonthView, setIsYearMonthView] = useState(false);

  const handleYearMonthClick = () => {
    setIsYearMonthView(!isYearMonthView);
  };

  return (
    <DatePicker
      selected={resetTime(selectedDate)}
      onChange={(date: Date) => onChange(date)}
      dateFormat="MM/dd/yy "
      timeCaption="Time"
      locale="ja"
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div>
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {"<"}
          </button>
          <button
            onClick={handleYearMonthClick}
            className="text-lg font-semibold mx-4"
          >
            {date.getFullYear()}年 {date.getMonth() + 1}月
          </button>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {">"}
          </button>
          {isYearMonthView && (
            <div>
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() + i}>
                    {new Date().getFullYear() + i}
                  </option>
                ))}
              </select>
              <select
                value={date.getMonth()}
                onChange={({ target: { value } }) => changeMonth(Number(value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    />
  );
};
