import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import neon from './neon-vite-plugin'

const config = defineConfig({
  plugins: [
    devtools(),
    // ⚠️ TanStack Start plugin MUST come BEFORE viteReact
    // to properly transform createServerFn into RPC stubs
    tanstackStart(),
    nitro(),
    neon,
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    viteReact(),
  ],
})

export default config
