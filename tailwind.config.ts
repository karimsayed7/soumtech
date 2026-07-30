import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      keyframes: {
        "underline-grow": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "underline-grow": "underline-grow 0.3s ease-out forwards",
      },
    },
  },
}

export default config