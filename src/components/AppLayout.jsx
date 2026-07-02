import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
      })}
    >
      <Navbar onMenuClick={handleMenuClick} />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerClose} />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="main"
            sx={{
              flex: 1,
              width: "100%",
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Outlet />
          </Box>

          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
