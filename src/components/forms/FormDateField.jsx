import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

function FormDateField({
  name,
  control,
  rules,
  trigger,
  helperText,
  InputLabelProps,
  slotProps,
  ...textFieldProps
}) {
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
          <TextField
            {...textFieldProps}
            {...field}
            fullWidth={textFieldProps.fullWidth ?? true}
            type="date"
            value={field.value ?? ""}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
              ...InputLabelProps
            }}
            slotProps={{
              ...slotProps,
              inputLabel: {
                shrink: true,
                ...(slotProps?.inputLabel || {})
              }
            }}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
          />
        );
      }}
    />
  );
}

export default FormDateField;
