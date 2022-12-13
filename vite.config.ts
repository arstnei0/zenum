import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import fg from 'fast-glob'

export default defineConfig({
	build: {
		lib: {
			entry: ["src/index.ts", 'src/dev.ts'],
			formats: ["es"],
		},
		rollupOptions: {
			external: ["zod"],
		},
	},
	plugins: [dts()],
})
