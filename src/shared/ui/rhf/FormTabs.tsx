import { Tab, Tabs, type TabsProps } from "@mui/material";
import { Controller, useController, type FieldValues } from "react-hook-form";

import type { FormInputProps } from "./FormInputProps";
import { useFieldDraft } from "./useFieldDraft";
import { useRef } from "react";

interface TabItem {
  value: string;
  label: string;
}

interface TabProps extends TabsProps {
  tabs: readonly TabItem[];
}

type Props<TFieldValues extends FieldValues = FieldValues> = Omit<
  FormInputProps<TFieldValues>,
  "label"
> &
  TabProps;

export const FormTabs = <TFieldValues extends FieldValues = FieldValues>(
  props: Props<TFieldValues>,
) => {
  const {
    name,
    control,
    rules,
    persistScope,
    draftStoreName,
    saveOnInput,
    disabled,
    tabs,
    sx: tabsSx,
  } = props;

  const { field } = useController({ name, control });

  const { clearDraft, save } = useFieldDraft({
    scope: persistScope,
    field: name as string,
    getValue: () => String(field.value ?? ""),
    storeName: draftStoreName,
  });

  const clearedRef = useRef(false);

  const shouldSaveValueOnChange = persistScope && draftStoreName && saveOnInput;

  const clearDraftOnce = () => {
    if (clearedRef.current) return;
    clearedRef.current = true;
    void clearDraft();
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Tabs
          variant="standard"
          sx={tabsSx}
          value={value}
          onChange={(_, value) => {
            onChange(value);
            clearDraftOnce();
            shouldSaveValueOnChange && save(value);
          }}
        >
          {tabs.map((tab) => (
            <Tab
              disabled={disabled}
              value={tab.value}
              key={tab.value}
              label={tab.label}
            />
          ))}
        </Tabs>
      )}
    />
  );
};
