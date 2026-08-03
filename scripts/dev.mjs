import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const tsxCli = fileURLToPath(new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url))

const children = [
  spawn(process.execPath, [viteCli, '--host', '127.0.0.1'], { stdio: 'inherit' }),
  spawn(process.execPath, [tsxCli, 'watch', 'server/index.ts'], { stdio: 'inherit' }),
]

let stopping = false

function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  setTimeout(() => process.exit(code), 100).unref()
}

for (const child of children) {
  child.on('error', (error) => {
    console.error(error.message)
    stop(1)
  })
  child.on('exit', (code) => {
    if (!stopping && code && code !== 0) stop(code)
  })
}

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
