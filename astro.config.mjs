import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind()],
  output: "static",
  image: {
    domains: ["img.cdn.nimg.jp"],
  },
});
