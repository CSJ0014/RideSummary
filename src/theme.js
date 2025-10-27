// === Material Design 3 Red–Blue Theme Tokens ===
export const colors = {
  primary: "#E53935",
  primaryDark: "#B71C1C",
  secondary: "#1E88E5",
  secondaryDark: "#0D47A1",
  surface: "#F9FAFC",
  surfaceAlt: "#FFFFFF",
  onSurface: "#1A1A1A",
  outline: "#E0E0E0",
  shadow: "rgba(0, 0, 0, 0.1)",
  hr: "#E53935",
  power: "#1E88E5",
  success: "#43A047",
  warning: "#FB8C00",
  error: "#E53935",
};
export const typography = {
  fontFamily: `"Inter", "Roboto", "Segoe UI", sans-serif`,
  titleLarge: { fontSize: "22px", fontWeight: 600 },
  titleMedium: { fontSize: "18px", fontWeight: 500 },
  body: { fontSize: "15px", fontWeight: 400 },
  label: { fontSize: "13px", fontWeight: 500, textTransform: "uppercase" },
};
export const shape = {
  cardRadius: 16,
  buttonRadius: 12,
};
export const shadows = {
  small: "0 1px 3px rgba(0,0,0,0.1)",
  medium: "0 2px 6px rgba(0,0,0,0.15)",
  large: "0 4px 12px rgba(0,0,0,0.2)",
};
export const transitions = {
  base: "0.2s ease-in-out",
};
const theme = { colors, typography, shape, shadows, transitions };
export default theme;
