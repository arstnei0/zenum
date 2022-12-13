import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
	entries: [
		{
			builder: "mkdist",
			input: "./core/",
			outDir: "./dist/core",
		},
	],
})
