import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import PageHeading from "../components/PageHeading";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user, userProfile, role } = useAuth();

  const name = userProfile?.name || "User";
  const email = userProfile?.email || user?.email || "No email available";
  const roleLabel = role === "admin" ? "Admin" : "User";

  return (
    <>
      <PageHeading
        title="Profile"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Profile" },
        ]}
      />

      <Card sx={{ maxWidth: 700 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2.5}
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mb: 3 }}
          >
            <Avatar
              sx={(theme) => ({
                width: 72,
                height: 72,
                fontSize: "1.75rem",
                fontWeight: 700,
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
              })}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h5" color="text.primary">
                {name}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {email}
              </Typography>

              <Chip
                label={roleLabel}
                color={role === "admin" ? "primary" : "info"}
                size="small"
                sx={{ mt: 1.25, fontWeight: 700 }}
              />
            </Box>
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>

              <Typography color="text.primary" sx={{ mt: 0.5 }}>
                {name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>

              <Typography color="text.primary" sx={{ mt: 0.5 }}>
                {email}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>

              <Typography color="text.primary" sx={{ mt: 0.5 }}>
                {roleLabel}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default ProfilePage;
