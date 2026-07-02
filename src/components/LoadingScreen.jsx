import { Box, CircularProgress, Typography } from "@mui/material";

function LoadingScreen({ message = "Loading Project Showcase..." }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 3
      }}
    >
      <CircularProgress color="primary" />

      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingScreen;
