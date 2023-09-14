import * as path from "node:path";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const outdir = path.resolve(root, "dist");

await fs.rm(outdir, { recursive: true, force: true });

const result = await Bun.build({
  root,
  entrypoints: [path.resolve(root, "entry-a.ts")],
  format: "esm",
  sourcemap: "external",
  splitting: true,
  outdir,
  target: "bun",
  minify: false,
  define: {
    "process.env.NODE_ENV": `"development"`,
  },
});

if (!result.success) {
  console.log(...result.logs);
  process.exit(1);
}

try {
  const { a } = await import("./dist/entry-a.js");
  a();
} catch (error) {
  console.log(error);

  console.log("Quick explanation...");
  process.exit(1);
}
