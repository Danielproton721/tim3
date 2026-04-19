import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tim: {
          blue: {
            DEFAULT: "#0029FF",
            primary: "#0029FF",
            dark: "#001FCC",
            light: "#3355FF",
            card: "#1540E5",
            topbar: "#0020D9",
          },
          red: "#EC1B2E",
          yellow: {
            DEFAULT: "#FFC800",
            dark: "#E6B300",
            badge: "#FFD500",
          },
          green: {
            DEFAULT: "#00C853",
            dark: "#00A846",
          },
          gray: {
            text: "#6B7280",
            bg: "#F9FAFB",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero-h1": ["clamp(40px, 5.5vw, 68px)", { lineHeight: "1.08", fontWeight: "900" }],
      },
      boxShadow: {
        "card-hover": "0 10px 30px -10px rgba(0,0,0,0.3)",
        "btn-yellow": "0 8px 20px -6px rgba(255,200,0,0.5)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(-8px)" },
          "50%": { transform: "translateY(8px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      letterSpacing: {
        widest2: "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
