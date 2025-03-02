import { createSystem, defaultConfig } from "@chakra-ui/react";

const customTheme = createSystem(defaultConfig, {
  globalCss: {
    body: {
      fontFamily: "Inter, sans-serif",
      height: "100%",
    },
    html: {
      bg: "bg.muted",
      scrollBehavior: "smooth",
      height: "100%",
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        total: { value: { base: "{colors.blue.50}", _dark: "{colors.blue.900}" } },
        progress: { value: { base: "{colors.yellow.50}", _dark: "{colors.yellow.900}" } },
        completed: { value: { base: "{colors.green.50}", _dark: "{colors.green.900}" } },
        spot: {
          value: { base: "{colors.green.50}", _dark: "{colors.green.900}" },
        },
      },
    },
  },
});

export default customTheme;
