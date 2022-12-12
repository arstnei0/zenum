import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts", "examples/*.ts"],
	dts: true,
	format: ["esm"],
})
