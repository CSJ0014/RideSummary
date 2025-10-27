// MD3 Theme tokens — Red & Blue
export const colors = {
  primary: "#E53935",
  secondary: "#1E88E5",
  surface: "#FFFFFF",
  background: "#F9F9FB",
  text: "#212121",
  outline: "#DADCE0",
  shadow: "rgba(0,0,0,0.10)",
  onPrimary: "#FFFFFF",
  onSurface: "#333333",

  // extras used in components
  onSurfaceVariant: "#5F6368",
  outlineVariant: "#E0E0E0",
  surfaceVariant: "#F5F7FA",
  surfaceContainerLowest: "#FAFAFC",
};

export const typography = {
  titleLarge: { fontSize: "1.5rem", fontWeight: 700, lineHeight: "1.3em" },
  titleMedium: { fontSize: "1.25rem", fontWeight: 600, lineHeight: "1.4em" },

  // small/label/body variants used in components
  titleSmall: { fontSize: "1rem", fontWeight: 600, lineHeight: "1.4em" },
  body: { fontSize: "1rem", fontWeight: 400, lineHeight: "1.6em" },
  bodyLarge: { fontSize: "1.0625rem", fontWeight: 400, lineHeight: "1.6em" },
  label: { fontSize: "0.875rem", fontWeight: 500, textTransform: "uppercase" },
  labelSmall: { fontSize: "0.8rem", fontWeight: 500 },
};

export const shape = {
  cardRadius: "12px",
  buttonRadius: "10px",
  chipRadius: "8px",
};

export const shadows = {
  small: "0 1px 3px rgba(0,0,0,0.10)",
  medium: "0 3px 6px rgba(0,0,0,0.12)",
  large: "0 6px 12px rgba(0,0,0,0.15)",
};

export default { colors, typography, shape, shadows };
