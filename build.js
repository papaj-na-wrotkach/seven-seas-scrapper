import { build } from "esbuild";
import Package from './package.json' assert { type: "json" };

build({
  // tsconfig: "./tsconfig.json",
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  external: Object.keys(Package.dependencies ?? {}).concat(Object.keys(Package.peerDependencies ?? {})),
  outfile: "dist/index.js",
  platform: 'node', // for ESM
  format: "esm",
  tsconfig: "tsconfig.json",
});