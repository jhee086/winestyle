import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'wine-taste-finder',
  brand: {
    displayName: '와인 취향 찾기',
    primaryColor: '#3182F6',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
