import {
  Tuple,
  DefaultMantineColor,
  MantineThemeOverride,
} from "@mantine/core";

type ExtendedCustomColors = "navyBlue" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

export const theme: MantineThemeOverride = {
  globalStyles: () => ({
    "*, *::before, *::after": {
      boxSizing: "border-box",
    },
  }),
  colors: {
    navyBlue: [
      "#EBEFFA",
      "#C7D3F0",
      "#A3B7E6",
      "#7F9ADC",
      "#5B7ED2",
      "#3761C8",
      "#2C4EA0",
      "#213A78",
      "#162750",
      "#0B1328",
    ],
  },
  colorScheme: "light",
  defaultRadius: 0,
  primaryColor: "navyBlue",
};
