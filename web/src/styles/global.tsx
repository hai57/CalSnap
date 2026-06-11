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

  html {
    background: ${colors.slate50};
  }

  body {
    margin: 0;
    background: transparent;
    color: ${colors.slate900};
    font-family: ${font.sans};
    -webkit-font-smoothing: antialiased;
  }
`;
