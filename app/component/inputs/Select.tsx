"use client";
import React from "react";
import ReactSelect from "react-select";
interface Selectprops {
  label: string;
  value: Record<string, any>;
  options: Record<string, any>[];
  onChange: (value: Record<string, any>) => void;
  disabled: boolean;
}

const Select: React.FC<Selectprops> = ({
  label,
  value,
  options,
  onChange,
  disabled,
}) => {
  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium text-gray-900 leading-6">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          options={options}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          classNames={{ control: () => "text-sm" }}
          isMulti={true}
        />
      </div>
    </div>
  );
};

export default Select;
