import { amber, blue, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow } from "@mui/material/colors";
const colorHue = 200;

export const randomColor = () => {
  const colors = [red[colorHue], pink[colorHue], purple[colorHue], deepPurple[colorHue], indigo[colorHue], blue[colorHue],
  lightBlue[colorHue], cyan[colorHue], teal[colorHue], green[colorHue], lightGreen[colorHue], lime[colorHue],
  yellow[colorHue], amber[colorHue], orange[colorHue], deepOrange[colorHue], brown[colorHue]];

  var rand_index = Math.floor(Math.random() * colors.length);
  return colors[rand_index];
}