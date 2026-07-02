import { Box, Card, CardContent, Typography } from "@mui/material";

function SummaryCard({ title, value, helperText, icon, tone = "primary" }) {
  return (
    <Card>
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography
              variant="h4"
              color="text.primary"
              sx={{
                mt: 1,
                fontWeight: 700,
              }}
            >
              {value}
            </Typography>

            {helperText && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.75 }}
              >
                {helperText}
              </Typography>
            )}
          </Box>

          <Box
            sx={(theme) => ({
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              borderRadius: theme.shape.borderRadius,
              color: theme.palette[tone].main,
              backgroundColor: theme.palette[tone].light,
            })}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
