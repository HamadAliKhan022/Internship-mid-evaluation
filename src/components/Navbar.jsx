import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  const userName = userProfile?.name || user?.email || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Unable to log out:", error);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
        <IconButton
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          sx={{ display: { md: "none" }, mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          color="text.primary"
          sx={{
            flexGrow: 1,
            fontSize: { xs: "1rem", sm: "1.15rem" },
          }}
        >
          Project Showcase
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              textAlign: "right",
            }}
          >
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {userName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {userProfile?.role || "User"}
            </Typography>
          </Box>

          <Tooltip title={userName}>
            <Avatar
              sx={(theme) => ({
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                fontWeight: 700,
              })}
            >
              {avatarLetter}
            </Avatar>
          </Tooltip>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutOutlinedIcon />}
            onClick={handleLogout}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            Logout
          </Button>

          <Tooltip title="Logout">
            <IconButton
              aria-label="Logout"
              color="primary"
              onClick={handleLogout}
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
