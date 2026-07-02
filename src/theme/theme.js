import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      dark: "#1D4ED8",
      light: "#DBEAFE",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569"
    },
    divider: "#E2E8F0",
    success: {
      main: "#16A34A"
    },
    warning: {
      main: "#D97706"
    },
    error: {
      main: "#DC2626"
    },
    info: {
      main: "#0284C7"
    }
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    },
    button: {
      fontWeight: 600
    }
  },

  shape: {
    borderRadius: 12
  },

  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320
        }
      }
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          borderRadius: currentTheme.shape.borderRadius,
          textTransform: "none",
          fontWeight: 600,
          paddingInline: currentTheme.spacing(2),
          "&:hover": {
            boxShadow: "none"
          }
        })
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          border: `1px solid ${currentTheme.palette.divider}`
        })
      }
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          borderRadius: currentTheme.shape.borderRadius,
          border: `1px solid ${currentTheme.palette.divider}`,
          boxShadow: "none"
        })
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          backgroundColor: currentTheme.palette.background.paper,
          borderRadius: currentTheme.shape.borderRadius,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: currentTheme.palette.divider
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: currentTheme.palette.primary.main
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2
          }
        })
      }
    },

    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme: currentTheme }) => ({
          border: `1px solid ${currentTheme.palette.divider}`,
          borderRadius: currentTheme.shape.borderRadius,
          backgroundColor: currentTheme.palette.background.paper,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: currentTheme.palette.background.default,
            borderBottom: `1px solid ${currentTheme.palette.divider}`
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: currentTheme.palette.text.primary
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: currentTheme.palette.primary.light
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${currentTheme.palette.divider}`
          }
        })
      }
    }
  }
});

export default theme;
