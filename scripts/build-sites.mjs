import { rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

function run(args) {
  const npmCli = process.env.npm_execpath
  if (!npmCli) throw new Error('npm CLI path is unavailable')
  const result = spawnSync(process.execPath, [npmCli, ...args], { stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

rmSync('dist', { recursive: true, force: true })
run(['exec', 'vue-tsc', '--', '--noEmit', '-p', 'tsconfig.app.json'])
run(['exec', 'tsc', '--', '-p', 'tsconfig.worker.json'])
run(['exec', 'vite', '--', 'build', '--outDir', 'dist/client', '--emptyOutDir'])
run(['exec', 'vite', '--', 'build', '--config', 'vite.worker.config.ts'])
