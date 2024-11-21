import { ThemeProvider } from "@emotion/react";

const theme = {
  color: "#ffcc00",
  backgroundColor: "back",
};

export function StyledComponent({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
