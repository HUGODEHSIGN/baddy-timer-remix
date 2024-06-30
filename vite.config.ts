import { vitePlugin as remix } from '@remix-run/dev';
import { createRequire } from 'node:module';
import { remixRoutes } from 'remix-routes/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
const require = createRequire(import.meta.url);

export default defineConfig({
  resolve: {
    alias: {
      fs: require.resolve('rollup-plugin-node-builtins'),
      // http: require.resolve('rollup-plugin-node-builtins'),
      // util: require.resolve('rollup-plugin-node-builtins'),
      // stream: require.resolve('rollup-plugin-node-builtins'),
      // buffer: require.resolve('rollup-plugin-node-builtins'),
      // process: require.resolve('rollup-plugin-node-builtins'),
      // url: require.resolve('rollup-plugin-node-builtins'),
      // querystring: require.resolve('rollup-plugin-node-builtins'),
    },
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    remixRoutes(),
    tsconfigPaths(),
  ],
  optimizeDeps: { exclude: ['@mapbox/node-pre-gyp'] },
});
