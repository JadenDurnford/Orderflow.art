import Select, { FormatOptionLabelMeta, StylesConfig } from "react-select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SelectItem } from "@/utils/types";

export default function StylizedMultiSelect({
  value,
  options,
  setValue,
  placeholder,
  firstChild = false,
  lastChild = false,
}: {
  value: SelectItem[];
  setValue: Dispatch<SetStateAction<SelectItem[]>>;
  options: SelectItem[] | undefined;
  placeholder: string;
  firstChild?: boolean;
  lastChild?: boolean;
}) {
  const [sortedOptions, setSortedOptions] = useState<SelectItem[]>();

  useEffect(() => {
    if (options) {
      const selectedOptions = [];
      const unselectedOptions = [];

      for (const option of options) {
        if (value.includes(option)) {
          selectedOptions.push(option);
        } else {
          unselectedOptions.push(option);
        }
      }

      setSortedOptions([...selectedOptions, ...unselectedOptions]);
    }
  }, [options, value]);

  const formatOptionLabel = (data: SelectItem, meta: FormatOptionLabelMeta<SelectItem>) => {
    const metaValues = meta.selectValue.map((pair) => pair.value);

    return (
      <div className="flex items-center justify-between" title={data.label}>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{data.label}</span>
        <input
          className="cursor-pointer"
          type="checkbox"
          checked={metaValues.includes(data.value)}
          readOnly
        />
      </div>
    );
  };

  return (
    <div className="flex max-w-full flex-1">
      <Select
        value={value}
        onChange={(newValue) => setValue([...newValue])}
        options={sortedOptions}
        classNames={{
          container: () => "w-full border-none",
          control: () =>
            `border-0 h-full rounded-none cursor-pointer shadow-[0_0_0_1px_#FDDFD8] ${
              firstChild ? "xl:firstChild" : lastChild ? "xl:lastChild" : ""
            } selectControl`,
          option: () => "bg-white text-black cursor-pointer hover:bg-dblue-200 active:bg-white",
          menuList: () => "rounded",
          placeholder: () => "overflow-hidden whitespace-nowrap text-ellipsis",
          multiValue: () => "[&>div>div>input]:hidden",
        }}
        formatOptionLabel={formatOptionLabel}
        isMulti={true}
        isDisabled={options ? false : true}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        placeholder={value.length ? `${placeholder} (${value.length})` : placeholder}
      />
    </div>
  );
}
