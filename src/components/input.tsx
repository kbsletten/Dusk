import React, { useLayoutEffect, useRef, useState } from "react";

export function Input({
  onChange,
  ...props
}: Omit<React.HTMLProps<HTMLInputElement>, "onChange"> & {
  onChange: (value: string) => void;
}) {
  return (
    <input onChange={(event) => onChange(event.target.value)} {...props} />
  );
}

type OptionProps<T> = T extends React.ReactNode
  ? { value?: T; children: T }
  : { value: T; children: string };

export function Option<T>({
  value,
  children,
  ...props
}: Omit<React.HTMLProps<HTMLOptionElement>, "value" | "children"> &
  OptionProps<T>) {
  return <option {...props}>{children}</option>;
}

export type Option<T> = { value: T; label: string };

export function Select<T>({
  onChange,
  options,
  value,
  ...props
}: Omit<
  React.HTMLProps<HTMLSelectElement>,
  "onChange" | "children" | "value"
> & {
  onChange: (selectedValue: T, selectedIndex: number) => void;
  options: Option<T>[];
  value?: T;
}) {
  const selectedIndex =
    value === undefined
      ? undefined
      : options.findIndex((option) => option.value === value);
  return (
    <select
      value={selectedIndex}
      onChange={(event) =>
        onChange(
          options[event.target.selectedIndex].value,
          event.target.selectedIndex
        )
      }
      {...props}
    >
      {options.map((option, index) => (
        <option key={index} value={index}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Textarea({
  value,
  onChange,
  ...props
}: Omit<React.HTMLProps<HTMLTextAreaElement>, "onChange" | "children"> & {
  onChange: (value: string) => void;
  value?: string;
}) {
  const [height, setHeight] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>();
  useLayoutEffect(() => {
    setHeight(textareaRef.current.scrollHeight);
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      onChange={(event) => onChange(event.target.value)}
      {...props}
      value={value}
      style={{ ...(props.style ?? {}), height }}
    />
  );
}
