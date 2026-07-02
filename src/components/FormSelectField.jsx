import { Controller } from "react-hook-form";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

function FormSelectField({
  name,
  control,
  label,
  rules,
  options,
  ...selectProps
}) {
  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={Boolean(fieldState.error)}>
          <InputLabel id={labelId}>{label}</InputLabel>

          <Select
            {...field}
            {...selectProps}
            labelId={labelId}
            label={label}
            value={field.value ?? ""}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>{fieldState.error?.message || ""}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default FormSelectField;
