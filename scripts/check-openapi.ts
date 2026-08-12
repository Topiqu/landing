import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

const path = resolve(import.meta.dir, '../public/openapi/v1.json')
const document = JSON.parse(await readFile(path, 'utf8'))

const failures = [
  document.openapi !== '3.1.0' && 'Expected OpenAPI 3.1.0',
  document.info?.version !== '1.0.0' && 'Expected API contract version 1.0.0',
  !document.paths?.['/articles']?.get && 'Missing GET /articles',
  !document.paths?.['/articles/{id}']?.get && 'Missing GET /articles/{id}',
  !document.components?.securitySchemes?.ApiKeyAuth && 'Missing ApiKeyAuth',
].filter(Boolean)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('OpenAPI contract is valid.')
