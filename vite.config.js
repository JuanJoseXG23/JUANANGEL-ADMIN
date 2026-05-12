import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || "/JUANANGEL-ADMIN/",
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ["firebase/app", "firebase/firestore"],
            pdf: ["pdf-lib"],
            react: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },
  };
});
