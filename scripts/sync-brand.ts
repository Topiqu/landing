import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyFile, mkdir } from 'node:fs/promises'

// Assets are copied at development time so Docker/CI never depend on a sibling checkout.
const root = fileURLToPath(new URL('../', import.meta.url))
const source = resolve(root, process.argv[2] || '../app/public')
const assets = process.argv.includes('--transparent')
  ? {
      'logo-removebg-preview.png': ['logo.png', 'brand/topiqu-wordmark.png'],
      'app-logo-removebg-preview.png': ['app-logo.png', 'brand/topiqu-mark.png'],
      'app-logo-dark-removebg-preview.png': ['brand/topiqu-mark-dark.png'],
      'apple-touch-icon-removebg-preview.png': ['apple-touch-icon.png'],
    }
  : {
      'logo.png': ['logo.png', 'brand/topiqu-wordmark.png'],
      'app-logo.png': ['app-logo.png', 'brand/topiqu-mark.png'],
      'app-logo-dark.png': ['brand/topiqu-mark-dark.png'],
      'favicon.ico': ['favicon.ico'],
      'apple-touch-icon.png': ['apple-touch-icon.png'],
      'icons/icon-192x192.png': ['icon-192x192.png'],
      'icons/icon-512x512.png': ['icon-512x512.png'],
    }

await mkdir(resolve(root, 'public/brand'), { recursive: true })
for (const [asset, destinations] of Object.entries(assets)) {
  for (const destination of destinations) {
    await copyFile(resolve(source, asset), resolve(root, 'public', destination))
  }
}
console.log('Topiqu brand assets synced from', source)
