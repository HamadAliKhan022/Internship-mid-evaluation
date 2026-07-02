import { Box, Button, Paper, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 3,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 520,
          p: { xs: 3, sm: 5 },
          textAlign: "center",
        }}
      >
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
          404
        </Typography>

        <Typography variant="h5" color="text.primary" sx={{ mt: 1 }}>
          Page not found
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3 }}>
          The page you are trying to open does not exist.
        </Typography>

        <Button
          variant="contained"
          startIcon={<HomeOutlinedIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}

export default NotFoundPage;
