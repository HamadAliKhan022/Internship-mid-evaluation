import { Controller } from "react-hook-form";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";

import FormErrorText from "./FormErrorText";

function FormMultiSelectField({
  name,
  control,
  rules,
  trigger,
  label,
  options = [],
  helperText,
  sx,
  fullWidth = true,
  ...selectProps
}) {
  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const handleChange = (event) => {
          const selectedValue = event.target.value;

          const nextValue =
            typeof selectedValue === "string"
              ? selectedValue.split(",")
              : selectedValue;

          field.onChange(nextValue);

          if (fieldState.error && trigger) {
            queueMicrotask(() => {
              trigger(name);
            });
          }
        };

        return (
          <FormControl
            fullWidth={fullWidth}
            error={Boolean(fieldState.error)}
            sx={sx}
          >
            <InputLabel id={labelId}>{label}</InputLabel>

            <Select
              {...selectProps}
              {...field}
              labelId={labelId}
              label={label}
              multiple
              value={Array.isArray(field.value) ? field.value : []}
              onChange={handleChange}
              renderValue={(selectedValues) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.75
                  }}
                >
                  {selectedValues.map((selectedValue) => (
                    <Chip
                      key={selectedValue}
                      label={selectedValue}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            >
              {options.map((option) => {
                const value =
                  typeof option === "string" ? option : option.value;

                const optionLabel =
                  typeof option === "string" ? option : option.label;

                return (
                  <MenuItem key={value} value={value}>
                    {optionLabel}
                  </MenuItem>
                );
              })}
            </Select>

            <FormErrorText
              error={fieldState.error}
              helperText={helperText}
            />
          </FormControl>
        );
      }}
    />
  );
}

export default FormMultiSelectField;
