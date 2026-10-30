/**
 * Starlight Press — Design System Configuration
 * Strict 3-color flat palette, Fraunces editorial serif display, Plus Jakarta Sans body.
 */

export const theme = {
  brand: {
    name: "Starlight Press",
    tagline: "Short runs, physical bindings, printed on demand.",
    claim: "Printed exclusively on 170gsm archival paper with sewn case bindings.",
    established: 2026,
    supportEmail: "hello@starlighttales.com"
  },
  colors: {
    // 3 Strict Flat Colours
    base: "#F7F4EE",             // Clean natural paper cream
    surface: "#FFFFFF",          // Flat white structural paper
    surfaceAlt: "#EFECE4",       // Subtle contrast row
    border: "#E4DFD5",           // Hairline edge divider
    
    text: "#17181C",             // Deep ink black
    textMuted: "#686C78",        // Neutral secondary text
    
    accent: "#C45A2C",           // Flat warm terracotta / burnt ochre
    accentHover: "#AD4B22",
    
    // Status (flat)
    success: "#266847",
    danger: "#B83232"
  },
  typography: {
    displayFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    codeFont: "'JetBrains Mono', monospace"
  }
};

