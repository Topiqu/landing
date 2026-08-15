import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})

async function capture(name, viewport, colorScheme = 'light') {
  const context = await browser.newContext({ viewport, colorScheme, deviceScaleFactor: 1 })
  await context.addCookies([{ name: 'cookie_consent', value: 'denied', domain: '127.0.0.1', path: '/' }])
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:3000/cs', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2500)
  if (colorScheme === 'dark') await page.evaluate(() => document.documentElement.classList.add('dark'))
  await page.screenshot({ path: `screenshots/${name}-full.png`, fullPage: true })
  await page.locator('section').first().screenshot({ path: `screenshots/${name}-hero.png` })
  await page.locator('header').evaluate((element) => { element.style.visibility = 'hidden' })
  await page.locator('#workflow').screenshot({ path: `screenshots/${name}-workflow.png` })
  if (name === 'desktop-light') {
    await page.locator('#specs').screenshot({ path: 'screenshots/desktop-light-features.png' })
    await page.locator('#about').screenshot({ path: 'screenshots/desktop-light-about.png' })
    await page.locator('#pricing').screenshot({ path: 'screenshots/desktop-light-pricing.png' })
  }
  await context.close()
}

async function captureComparison(name, viewport) {
  const context = await browser.newContext({ viewport, colorScheme: 'light', deviceScaleFactor: 1 })
  await context.addCookies([{ name: 'cookie_consent', value: 'denied', domain: '127.0.0.1', path: '/' }])
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:3000/cs/comparison', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true })
  await context.close()
}

await capture('desktop-light', { width: 1440, height: 1000 })
await capture('mobile-light', { width: 390, height: 844 })
await capture('desktop-dark', { width: 1440, height: 1000 }, 'dark')
await captureComparison('desktop-light-comparison-full', { width: 1440, height: 1000 })
await captureComparison('mobile-light-comparison-full', { width: 390, height: 844 })
await browser.close()
