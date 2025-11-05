import React from "react";

interface Option {
  id: number | string;
  label: string;
}

interface MultiSelectProps {
  data: Option[];
  value: (number | string)[];
  onChange: (selected: (number | string)[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ data, value, onChange }) => {
  const toggle = (id: number | string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="border rounded p-2 max-h-40 overflow-auto">
      {data.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="accent-neutral-400"
            checked={value.includes(item.id)}
            onChange={() => toggle(item.id)}
          />
          <span>{item.label}</span>
        </div>
      ))}
      {data.length === 0 && <p className="text-sm text-gray-500">No options available</p>}
    </div>
  );
};
