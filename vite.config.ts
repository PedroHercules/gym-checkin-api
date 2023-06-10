import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
})

// To connect your environment test, run 'npm link' on environment test folder to
// create something like local repository

// After run 'npm link <vitest-environment-name>' in root folder
