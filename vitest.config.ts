import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.spec.ts',
        // entry points
        'src/index.ts',
        'src/rollup.ts',
        'src/vite.ts',
        'src/webpack.ts',
        'src/types.ts',
      ],
    },
  },
})