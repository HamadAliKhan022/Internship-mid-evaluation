import { FormHelperText } from "@mui/material";

function FormErrorText({ error, helperText }) {
  const message = error?.message || helperText;

  if (!message) {
    return null;
  }

  return (
    <FormHelperText error={Boolean(error)}>
      {message}
    </FormHelperText>
  );
}

export default FormErrorText;
