import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      lib: resolve(import.meta.dirname, "lib"),
      templates: resolve(import.meta.dirname, "templates"),
      tests: resolve(import.meta.dirname, "tests"),
      website: resolve(import.meta.dirname, "website"),
    },
  },
})
