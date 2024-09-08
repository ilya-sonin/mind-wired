/// <reference types="vitest" />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
	build: {
		sourcemap: true,
		minify: 'esbuild',
		lib: {
			entry: 'src/index.ts',
			name: 'mindwired',
			fileName: 'mind-wired',
		},
	},
	plugins: [
		dts({
			rollupTypes: true,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '/src'),
		},
	},
})
