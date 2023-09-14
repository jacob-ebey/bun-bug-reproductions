import * as path from "node:path";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const outdir = path.resolve(root, "dist");

await fs.rm(outdir, { recursive: true, force: true });

const result = await Bun.build({
  root,
  entrypoints: [
    path.resolve(root, "entry-a.ts"),
    path.resolve(root, "entry-b.ts"),
  ],
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
  const { a, b } = await import("./dist/entry-a.js");
  a();
  b();
} catch (error) {
  console.log(error);

  console.log(
    "Check ./bugs/bundler-double-exports/dist/entry-a.js file for the issue."
  );
  console.log("It seems to arise when re-exporting from another entrypoint.");
  process.exit(1);
}
