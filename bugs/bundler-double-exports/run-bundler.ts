import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const result = await Bun.build({
  root,
  entrypoints: [
    path.resolve(root, "entry-a.ts"),
    path.resolve(root, "entry-b.ts"),
    // path.resolve(root, "app/another/entry.tsx"),
    // path.resolve(root, "actions/log.tsx"),
    // path.resolve(root, "actions/say-hello.tsx"),
  ],
  format: "esm",
  sourcemap: "external",
  splitting: true,
  outdir: path.resolve(root, "dist"),
  target: "bun",
  minify: false,
  define: {
    "process.env.NODE_ENV": `"development"`,
  },
});

console.log(...result.logs);
