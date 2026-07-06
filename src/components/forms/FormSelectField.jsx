import { Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";

import FormErrorText from "./FormErrorText";

function FormSelectField({
  name,
  control,
  rules,
  trigger,
  label,
  options = [],
  helperText,
  children,
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
          field.onChange(event);

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
              value={field.value ?? ""}
              onChange={handleChange}
            >
              {children ||
                options.map((option) => {
                  const value =
                    typeof option === "string" ? option : option.value;

                  const optionLabel =
                    typeof option === "string" ? option : option.label;

                  return (
                    <MenuItem
                      key={value}
                      value={value}
                      disabled={Boolean(option.disabled)}
                    >
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

export default FormSelectField;
