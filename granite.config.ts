import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'winelover',
  brand: {
    displayName: '취향와인',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/appsintoss/34653/a2c33104-3778-4076-937e-19775f1fec90.png',
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
