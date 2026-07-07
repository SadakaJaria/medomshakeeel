import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * يشغّل api/analyze.js داخل dev server حتى يعمل تحليل AI مع npm run dev
 * بنفس كود الإنتاج (Vercel function). المفتاح يُقرأ من .env كـ ANTHROPIC_API_KEY.
 */
function apiDevPlugin(env) {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/analyze', async (req, res) => {
        if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) {
          process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
        }
        if (env.ANALYZE_MODEL && !process.env.ANALYZE_MODEL) {
          process.env.ANALYZE_MODEL = env.ANALYZE_MODEL
        }
        const { default: handler } = await server.ssrLoadModule('/api/analyze.js')
        return handler(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      apiDevPlugin(env),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'ميداس الحلال',
          short_name: 'ميداس الحلال',
          description: 'تيرمينال أسواق مالية شخصي متوافق مع الشريعة الإسلامية',
          lang: 'ar',
          dir: 'rtl',
          display: 'standalone',
          background_color: '#0a0e14',
          theme_color: '#0a0e14',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
  }
})
