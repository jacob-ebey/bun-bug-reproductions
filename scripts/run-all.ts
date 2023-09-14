import * as fs from "node:fs/promises";
import * as path from "node:path";

const cwd = process.cwd();
const bugsDir = path.resolve(cwd, "bugs");

const dirs = await fs.readdir(bugsDir, { withFileTypes: true });

let failed = false;
for (const dir of dirs) {
  if (!dir.isDirectory()) continue;

  const test = Bun.spawn(["bun", "start"], {
    cwd: path.resolve(bugsDir, dir.name),
    stderr: "pipe",
    stdout: "pipe",
  });

  const reader = test.readable.getReader();
  const decoder = new TextDecoder();
  let testOutput = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      testOutput += decoder.decode(value);
    }
    testOutput += decoder.decode();
  } catch {}

  const exitCode = await test.exited.catch(() => "unknown");
  if (exitCode === 0) {
    // do the above log with the `PASSED` in green
    console.log(`- \x1b[32mPASSED\x1b[0m ${dir.name}`);
  } else {
    failed = true;
    console.log(
      `- \x1b[31mFAILED\x1b[0m ${dir.name}:\n${testOutput
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n")}${"-".repeat(80)}`
    );
  }
}

console.log("");
if (failed) {
  console.log("\x1b[31mSome tests failed\x1b[0m");
  process.exit(1);
} else {
  console.log("\x1b[32mAll tests passed!\x1b[0m");
}
