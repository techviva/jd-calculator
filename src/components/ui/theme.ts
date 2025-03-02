import { createSystem, defaultConfig } from "@chakra-ui/react";

export const customTheme = createSystem(defaultConfig, {
  globalCss: {
    body: {
      height: "100%",
      position: "relative",
    },
    html: {
      scrollBehavior: "smooth",
      bg: "bg.subtle",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-inter)" },
        body: { value: "var(--font-inter)" },
      },
    },
  },
});
