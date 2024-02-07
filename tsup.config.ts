import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig({
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: false,
    clean: true,
    experimentalDts: false,
    format: ["cjs"],
    platform: "node",
    minify: "terser",
    external: Object.keys(pkg.devDependencies)
});