import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true, // ✅ Dark mode otomatis berdasarkan sistem
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "gray.800",
        _dark: {
          bg: "gray.900",
          color: "gray.200",
        },
      },
    },
  },
});

export default theme;
