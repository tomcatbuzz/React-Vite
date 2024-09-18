/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/ original config if the new one breaks
// export default defineConfig({
//   esbuild: {
//     loader: 'jsx',
//   },
//   optimizeDeps: {
//     esbuildOptions: {
//       loader: {
//         '.js': 'jsx',
//       },
//     },
//   },
//   plugins: [react(), glsl()],
// })

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  console.log('Build mode:', mode)
  console.log('VITE_ENTERPRISE_KEY:', env.VITE_ENTERPRISE_KEY)

  return {
    esbuild: {
      loader: 'jsx',
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react(), glsl()],
    define: {
      'process.env.VITE_ENTERPRISE_KEY': JSON.stringify(env.VITE_ENTERPRISE_KEY),
    },
  }
})