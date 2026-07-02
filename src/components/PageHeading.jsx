import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function PageHeading({ title, breadcrumbs = [], action }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              mb: 0.75,
              "& .MuiBreadcrumbs-separator": {
                color: "text.secondary",
              },
            }}
          >
            {breadcrumbs.map((item, index) => {
              const isLastItem = index === breadcrumbs.length - 1;

              if (isLastItem || !item.path) {
                return (
                  <Typography
                    key={item.label}
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.label}
                  </Typography>
                );
              }

              return (
                <Link
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  underline="hover"
                  variant="body2"
                  color="text.secondary"
                >
                  {item.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}

        <Typography variant="h4" color="text.primary">
          {title}
        </Typography>
      </Box>

      {action && <Box>{action}</Box>}
    </Box>
  );
}

export default PageHeading;
