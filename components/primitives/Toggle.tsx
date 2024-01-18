import { Dispatch, SetStateAction } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";

export default function StylizedToggle({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={`flex-1 pt-1.5`}>
      <Toggle
        checked={checked}
        onChange={({ target: { checked: isChecked } }) => {
          setChecked(isChecked);
        }}
        icons={{ checked: null, unchecked: null }}
        className={`[&>*:first-child]:w-11 ${checked ? "[&>*:nth-child(2)]:left-[21px]" : ""}`}
        width={8}
      />
    </div>
  );
}
