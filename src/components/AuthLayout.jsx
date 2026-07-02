import { Box, Paper, Typography } from "@mui/material";

function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      component="main"
      sx={(theme) => ({
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.background.default,
      })}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            Project Showcase
          </Typography>

          <Typography variant="h4" color="text.primary">
            {title}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        </Box>

        {children}
      </Paper>
    </Box>
  );
}

export default AuthLayout;
