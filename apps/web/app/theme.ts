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
});

export default theme;
