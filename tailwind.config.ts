import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050509",
          900: "#0b0b12",
          800: "#101024"
        },
        blood: {
          700: "#c0001a",
          600: "#e0001f",
          500: "#ff1538"
        }
      },
      boxShadow: {
        brutal:
          "0 0 0 1px rgba(255,21,56,0.35), 0 10px 30px rgba(0,0,0,0.6), 0 0 70px rgba(255,21,56,0.12)"
      },
      backgroundImage: {
        scanlines:
          "linear-gradient(to bottom, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 2px)",
        "red-glow":
          "radial-gradient(closest-side, rgba(255,21,56,0.28), rgba(255,21,56,0.0))"
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.95" },
          "45%": { opacity: "0.85" },
          "50%": { opacity: "0.7" },
          "55%": { opacity: "0.9" }
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-2px)" }
        }
      },
      animation: {
        flicker: "flicker 2.8s infinite",
        floaty: "floaty 3.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;

