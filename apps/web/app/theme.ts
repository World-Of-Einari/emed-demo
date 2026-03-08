import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#60243a",
    },
    background: {
      default: "#e3e3e4",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "rgb(227, 227, 228)",
      disabled: "#ffffff",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          "&:before": { borderBottomColor: "rgba(0,0,0,0.2)" },
          "&:hover:not(.Mui-disabled):before": { borderBottomColor: "rgba(0,0,0,0.4)" },
          "&:after": { borderBottomColor: "#60243a" },
        },
      },
    },
  },
});

export default theme;
