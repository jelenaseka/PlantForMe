import { createTheme } from "@mui/material";
import { green, orange, purple, red, yellow } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
      light:green[300],
      // dark: '',
      // contrastText:''
    },
    secondary: {
      main: yellow[500],
      light: yellow[300]
    },
    // info: {

    // },
    // warning: {

    // },
    // error: {

    // },
    // success: {

    // }
  },
  status: {
    danger: orange[500],
  },
});