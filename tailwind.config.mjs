import defaultTheme from "tailwindcss/defaultTheme";

import pluginContainerQueries from "@tailwindcss/container-queries"; 
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}"],
  theme: { 
    zIndex: {
      0: 0,
      1: 1,
      infinity: 9999,
    },
    extend: {
      fontFamily: { 
      }, 
    },
  },
  plugins: [ 
    pluginContainerQueries,  
  ],
};
