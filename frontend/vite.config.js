import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const clientEnv = {
    NODE_ENV: mode,
    ...Object.fromEntries(
      Object.entries(env).filter(([key]) =>
        key.startsWith("REACT_APP_") || key.startsWith("VITE_"),
      ),
    ),
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      "process.env": JSON.stringify(clientEnv),
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
    },
  };
});
