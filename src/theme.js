// ==========================================================
// Material Design 3 (MD3) Theme System – Red & Blue Palette
// ==========================================================

// ---- Colors ----
export const colors = {
  primary: "#E53935",     // Red
  secondary: "#1E88E5",   // Blue
  surface: "#FFFFFF",     // Cards, panels
  background: "#F9F9FB",  // Page background
  text: "#212121",        // Main text
  outline: "#DADCE0",     // Borders / dividers
  shadow: "rgba(0, 0, 0, 0.1)", // General elevation
  onPrimary: "#FFFFFF",
  onSurface: "#333333",
};

// ---- Typography ----
export const typography = {
  titleLarge: {
    fontSize: "1.5rem",
    fontWeight: 700,
    lineHeight: "1.3em",
  },
  titleMedium: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: "1.4em",
  },
  body: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: "1.6em",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "uppercase",
  },
};

// ---- Shape ----
export const shape = {
  cardRadius: "12px",
  buttonRadius: "10px",
  chipRadius: "8px",
};

// ---- Shadows ----
export const shadows = {
  small: "0 1px 3px rgba(0, 0, 0, 0.1)",
  medium: "0 3px 6px rgba(0, 0, 0, 0.12)",
  large: "0 6px 12px rgba(0, 0, 0, 0.15)",
};

// ---- Theme Helpers ----
export const theme = {
  colors,
  typography,
  shape,
  shadows,
};

// Default export (optional)
export default theme;
