// src/styles/GlobalStyles.ts
import { createGlobalStyle } from "styled-components";
import { Theme } from "./theme";

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  * {
    box-sizing: border-box;
  }
`;
