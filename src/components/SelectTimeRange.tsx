import { Dispatch, FC } from "react";

type SelectTimeRangeProps = {
  onChange: Dispatch<string>;
};

export const SelectTimeRange: FC<SelectTimeRangeProps> = ({ onChange }) => {
  return (
    <select
      required
      name="time-range"
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
    >
      <option value="">Select time range</option>
      <option value="week">Last week (per day)</option>
      <option value="month">Last month (per day)</option>
      <option value="year">Last year (per day)</option>
    </select>
  );
};
