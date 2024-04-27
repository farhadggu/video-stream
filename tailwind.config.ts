import type { Config } from "tailwindcss";

export const tailwindColors: { [key: string]: string } = {
  current: "currentColor",
  transparent: "transparent",
  white: "#F9F9F9",
  primary: "#007BEC",
  "primary-content": "#FFFFFF",
  secondary: "#6c5ce7",
  "secondary-content": "#FFFFFF",
};

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [],
};
export default config;
