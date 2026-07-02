import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 248;

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: <FolderOutlinedIcon />,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: <AccountCircleOutlinedIcon />,
  },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);

    if (onClose) {
      onClose();
    }
  };

  return (
    <Box
      sx={(theme) => ({
        height: "100%",
        pt: 2,
        backgroundColor: theme.palette.background.paper,
      })}
    >
      <List sx={{ px: 1.5 }}>
        {navigationItems.map((item) => {
          const isActive =
            item.path === "/projects"
              ? location.pathname.startsWith("/projects")
              : location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => handleNavigation(item.path)}
              sx={(theme) => ({
                mb: 0.75,
                borderRadius: theme.shape.borderRadius,
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
              })}
            >
              <ListItemIcon
                sx={(theme) => ({
                  minWidth: 38,
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                })}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.92rem",
                  fontWeight: isActive ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <Box
        component="aside"
        sx={(theme) => ({
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        })}
      >
        <Toolbar sx={{ minHeight: { sm: 72 } }} />
        <SidebarContent />
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }} />
        <SidebarContent onClose={onClose} />
      </Drawer>
    </>
  );
}

export default Sidebar;
