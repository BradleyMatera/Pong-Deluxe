import { defineConfig } from 'vite'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'Pong-Deluxe'
const base = process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/'

export default defineConfig({
  base,
})
