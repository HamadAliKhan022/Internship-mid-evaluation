import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

function FormTextField({
  name,
  control,
  label,
  rules,
  type = "text",
  multiline = false,
  rows,
  autoComplete,
  ...textFieldProps
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...textFieldProps}
          fullWidth
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          autoComplete={autoComplete}
          value={field.value ?? ""}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message || ""}
        />
      )}
    />
  );
}

export default FormTextField;
