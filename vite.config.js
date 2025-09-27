import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const base = env.VITE_GITHUB_PAGES_BASE?.trim() || '/'

  return {
    base,
    plugins: [react()],
  }
})
