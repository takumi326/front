import {
    columnPurposeNames,
    purposeDate,
    selectPurposeDate,
  } from "@/interface/purpose-interface";

  import {
    columnTaskNames,
    taskDate,
    selectTaskDate,
  } from "@/interface/task-interface";

type dateType = purposeDate| taskDate;
type columnName = typeof columnPurposeNames|
typeof  columnTaskNames;

// TableShowコンポーネントのprops
export interface Props {
    dateType: dateType; // dateTypeはpurposeDate[]かtaskDate[]のどちらか
    columnName: columnName;
  }