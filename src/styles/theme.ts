export const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    light: "#f8f9fa",
    dark: "#343a40",
    white: "#ffffff",
    background: "#f7f9fc",
    sidebarBg: "#2c3e50",
    sidebarText: "#ecf0f1",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
  },
  shadows: {
    card: "0 4px 6px rgba(0, 0, 0, 0.1)",
    sidebar: "2px 0 5px rgba(0, 0, 0, 0.1)",
  },
};

// Add type definition for the theme
export type Theme = typeof theme;
