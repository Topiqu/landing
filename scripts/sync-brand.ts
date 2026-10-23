import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { resolve, join } from 'node:path'
import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises'

// Assets are prepared at development time; Docker/CI do not need Caesium or a sibling checkout.
const root = fileURLToPath(new URL('../', import.meta.url))
const source = resolve(root, process.argv.slice(2).find((arg) => !arg.startsWith('--')) || '../app/public')
const caesium = process.env.CAESIUM_CLT || Bun.which('caesiumclt')
if (!caesium)
  throw new Error('Install caesiumclt or set CAESIUM_CLT to its executable path before syncing brand assets.')

const assets = process.argv.includes('--transparent')
  ? {
      'logo-removebg-preview.png': ['logo.webp', 'brand/topiqu-wordmark.webp'],
      'app-logo-removebg-preview.png': ['app-logo.webp', 'brand/topiqu-mark.webp', 'brand/topiqu-mark.png'],
      'app-logo-dark-removebg-preview.png': ['brand/topiqu-mark-dark.webp'],
      'apple-touch-icon-removebg-preview.png': ['apple-touch-icon.png'],
    }
  : {
      'logo.png': ['logo.webp', 'brand/topiqu-wordmark.webp'],
      'app-logo.png': ['app-logo.webp', 'brand/topiqu-mark.webp', 'brand/topiqu-mark.png'],
      'app-logo-dark.png': ['brand/topiqu-mark-dark.webp'],
      'favicon.ico': ['favicon.ico'],
      'apple-touch-icon.png': ['apple-touch-icon.png'],
      'icons/icon-192x192.png': ['icon-192x192.png'],
      'icons/icon-512x512.png': ['icon-512x512.png'],
    }

const staging = await mkdtemp(join(tmpdir(), 'topiqu-brand-'))
const runCaesium = async (args: string[], asset: string) => {
  const child = Bun.spawn([caesium, '--lossless', '--overwrite', 'all', ...args], {
    stdout: 'inherit',
    stderr: 'inherit',
  })
  if (await child.exited) throw new Error(`Caesium failed to process ${asset}`)
}
try {
  const pngDirectory = join(staging, 'png')
  await mkdir(pngDirectory)
  for (const [asset, destinations] of Object.entries(assets)) {
    const input = resolve(source, asset)
    let converted = ''
    let pngSource = input
    if (asset.endsWith('.png')) {
      // Temporary copies give Caesium predictable names without overwriting source files.
      const stagedInput = join(staging, 'asset.png')
      await copyFile(input, stagedInput)
      if (destinations.some((destination) => destination.endsWith('.webp'))) {
        await runCaesium(['--format', 'webp', '--output', staging, stagedInput], asset)
        converted = join(staging, 'asset.webp')
      }
      if (destinations.some((destination) => destination.endsWith('.png'))) {
        await runCaesium(['--png-opt-level', '4', '--output', pngDirectory, stagedInput], asset)
        const optimized = join(pngDirectory, 'asset.png')
        if (Bun.file(optimized).size < Bun.file(input).size) pngSource = optimized
      }
    }
    for (const destination of destinations) {
      const target = resolve(root, 'public', destination)
      await mkdir(resolve(target, '..'), { recursive: true })
      await copyFile(destination.endsWith('.webp') ? converted : pngSource, target)
    }
  }
} finally {
  await rm(staging, { recursive: true, force: true })
}
console.log('Topiqu brand assets synced from', source)
