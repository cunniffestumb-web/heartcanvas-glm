import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnvFile } from 'node:process'

export interface ProviderConfig {
  baseUrl: string
  authToken: string
  model: string
}

let envLoaded = false

function loadLocalEnv() {
  if (envLoaded) return
  const envPath = resolve(process.cwd(), '.env')
  if (existsSync(envPath)) loadEnvFile(envPath)
  envLoaded = true
}

export function getProviderConfig(): ProviderConfig | null {
  loadLocalEnv()
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN?.trim()
  if (!authToken) return null

  return {
    authToken,
    baseUrl: process.env.ANTHROPIC_BASE_URL?.trim() || 'https://api.deepseek.com/anthropic',
    model: process.env.ANTHROPIC_MODEL?.trim() || 'deepseek-v4-pro',
  }
}

export function getServerPort(): number {
  loadLocalEnv()
  const value = Number(process.env.PORT || 8787)
  return Number.isInteger(value) && value > 0 && value < 65536 ? value : 8787
}
