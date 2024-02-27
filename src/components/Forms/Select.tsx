import { FC } from "react";
import { SelectInterface } from "@_types/Forms/interface";

export const DropDown: FC<SelectInterface> = ({
  ariaPlaceHolder,
  value,
  onChange,
  required,
  data = [],
  disabled
}) => {
  return (
    <div className="select-container relative w-full">
      <select
        className="h-full w-full tex-gray-300 border-2 border-black p-2 text-center rounded-lg mb-5"
        value={value}
        onChange={onChange}
        autoComplete="autocomplete_off_hack_xfr4!k"
        aria-controls="multiselect-options"
        aria-expanded="false"
        aria-labelledby="assist"
        role="combobox"
        id="underlined_dropdown"
        required={required}
        disabled={disabled}
      >
        <option value="" hidden>
          {value ? value : ariaPlaceHolder}
        </option>
        {data.length ? (
          data.map(
            (item: any, index: number) => {
              return (
                <option key={index} value={item.id}>
                  {item.title}
                </option>
              );
            }
          )
        ) : (
          <option value="" disabled>
            The list is empty
          </option>
        )}
      </select>
    
    </div>
  );
};