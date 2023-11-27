import fs from "fs/promises"
import dts from "bun-plugin-dts"

const pkgBuf = await fs.readFile("package.json")
const pkg: { dependencies: Record<string, string> } = JSON.parse(
  pkgBuf.toString()
)
await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  target: "bun",
  splitting: false,
  external: Object.keys(pkg.dependencies ?? {}),
  minify: true,
  plugins: [dts()],
})

export {}
