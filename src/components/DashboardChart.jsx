import { Box, Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DashboardChart({ data }) {
  const theme = useTheme();

  return (
    <Card>
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
          "&:last-child": {
            pb: { xs: 2, sm: 3 },
          },
        }}
      >
        <Typography variant="h6" color="text.primary" sx={{ mb: 3 }}>
          Projects by Category
        </Typography>

        <Box sx={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 8,
                right: 12,
                left: -18,
                bottom: 8,
              }}
            >
              <CartesianGrid vertical={false} stroke={theme.palette.divider} />

              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                }}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  fill: theme.palette.background.default,
                }}
                contentStyle={{
                  borderColor: theme.palette.divider,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: theme.palette.background.paper,
                }}
              />

              <Bar
                dataKey="projects"
                name="Projects"
                fill={theme.palette.primary.main}
                radius={[
                  theme.shape.borderRadius,
                  theme.shape.borderRadius,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DashboardChart;
