import { createGlobalStyle } from "styled-components";

import { colors, font } from "./theme";

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    margin: 0;
    background:
      radial-gradient(1200px 600px at 100% -10%, ${colors.brand100} 0%, transparent 50%),
      radial-gradient(900px 500px at -10% 110%, #cffafe 0%, transparent 45%),
      ${colors.slate50};
    color: ${colors.slate900};
    font-family: ${font.sans};
    -webkit-font-smoothing: antialiased;
  }
`;
