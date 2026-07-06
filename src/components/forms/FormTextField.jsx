import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

function FormTextField({
  name,
  control,
  rules,
  trigger,
  helperText,
  children,
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
            value={field.value ?? ""}
            onChange={handleChange}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? helperText}
          >
            {children}
          </TextField>
        );
      }}
    />
  );
}

export default FormTextField;
