import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        px: { xs: 2, sm: 3, md: 4 },
        py: 2.25,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      })}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        Project Showcase · RiseTech Mid-Internship Evaluation
      </Typography>
    </Box>
  );
}

export default Footer;
