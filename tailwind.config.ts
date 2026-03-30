import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f8ff",
        ink: "#102142",
        primary: {
          DEFAULT: "#2563eb",
          soft: "#dbeafe",
          deep: "#1d4ed8",
        },
      },
      boxShadow: {
        card: "0 18px 45px rgba(37, 99, 235, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
