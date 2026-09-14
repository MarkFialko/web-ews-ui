// TODO: строки 1-36 (импорты и тип PhoneNumberSelectProps) не попали в кадр
// ни на одном фото. По использованию ниже точно нужны: Autocomplete, TextField,
// type AutocompleteInputChangeReason из "@mui/material"; useAddressBook (см.
// modules/cti/components/CTIBlock/tabs/AddressBook/useAddressBook.ts);
// filterPhoneNumberValue (см. modules/cti/utils). Нужны ещё фото начала файла.

export const PhoneNumberSelect = (props: PhoneNumberSelectProps) => {
  const { label, value, helperText, disabled, onChange, onFocus } = props;
  const entries = useAddressBook();
  const selectedEntry = entries.find((e) => e.value === value) || null;

  return (
    <Autocomplete
      freeSolo
      forcePopupIcon
      fullWidth
      size="small"
      disabled={disabled}
      options={entries}
      getOptionLabel={(option) => option.name}
      value={selectedEntry}
      inputValue={value}
      onChange={(_, selectedValue) => {
        const newValue = selectedValue
          ? typeof selectedValue === "string"
            ? selectedValue
            : selectedValue.value
          : "";
        onChange?.(filterPhoneNumberValue(newValue));
      }}
      onInputChange={(_, inputValue, reason: AutocompleteInputChangeReason) => {
        if (reason === "input" || reason === "clear") {
          onChange?.(filterPhoneNumberValue(inputValue));
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
          onFocus={onFocus}
        />
      )}
    />
  );
};
