import { Box, Typography } from "@mui/material";

function ReviewRow({ label, children }) {
  return (
    <Box sx={{ display: "contents" }}>
      <Typography color="text.secondary">{label}</Typography>

      <Box>
        {typeof children === "string" ? (
          <Typography color="text.primary">{children}</Typography>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}

export default ReviewRow;
