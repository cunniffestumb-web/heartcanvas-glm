import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist/server',
    emptyOutDir: true,
    minify: true,
    lib: {
      entry: resolve(import.meta.dirname, 'worker/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
})
