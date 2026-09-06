// Derived from bhaoo/endfield-gacha 72c526d49136fd23271f77e9ef33549de3721283.
// Copyright (c) 2026 Bhao; MIT notice: licenses/bhaoo-MIT.txt.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  devServer: { host: process.env.TAURI_DEV_HOST || '127.0.0.1', port: 3000 },
  vite: { clearScreen: false, envPrefix: ['VITE_', 'TAURI_'], server: { strictPort: true } },
  ignore: ['**/src-tauri/**'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: { title: 'Endfield Trace · 授权验证', htmlAttrs: { lang: 'zh-CN' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }] },
  },
})
