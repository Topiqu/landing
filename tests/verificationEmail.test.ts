import { afterAll, beforeAll, beforeEach, expect, mock, spyOn, test } from 'bun:test'

const names = ['useRuntimeConfig', 'createError']
const originalGlobals = Object.fromEntries(names.map((name) => [name, (globalThis as any)[name]]))
const envNames = ['SES_REGION', 'SES_ACCESS_KEY_ID', 'SES_SECRET_ACCESS_KEY']
const originalEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]))
const messages: any[] = []
let response: any
let failure: Error | undefined
const info = spyOn(console, 'info').mockImplementation(() => {})
const error = spyOn(console, 'error').mockImplementation(() => {})
const log = spyOn(console, 'log').mockImplementation(() => {})
mock.module('@aws-sdk/client-sesv2', () => ({
  SESv2Client: class {
    config: any
    constructor(options: any) {
      this.config = { region: async () => options.region }
    }
    async send(command: any) {
      messages.push(command.input)
      if (failure) throw failure
      return response
    }
  },
  SendEmailCommand: class {
    constructor(public input: any) {}
  },
}))

let send: (typeof import('../server/utils/email'))['sendVerificationCode']
let devSend: typeof send
beforeAll(async () => {
  Object.assign(globalThis, {
    useRuntimeConfig: () => ({ aws: {}, emailFrom: 'Topiqu <test@example.test>' }),
    createError: (options: any) => Object.assign(new Error(options.message), options),
  })
  ;({ sendVerificationCode: send } = await import('../server/utils/email'))
  const build = await Bun.build({
    entrypoints: ['server/utils/email.ts'],
    target: 'bun',
    external: ['@aws-sdk/client-sesv2'],
    define: { 'import.meta.dev': 'true' },
  })
  if (!build.success) throw new Error('Could not build the development email fixture')
  const source = await build.outputs[0]!.text()
  ;({ sendVerificationCode: devSend } = await import(
    `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
  ))
})
beforeEach(() => {
  Object.assign(process.env, {
    SES_REGION: 'eu-central-1',
    SES_ACCESS_KEY_ID: 'test-access-key',
    SES_SECRET_ACCESS_KEY: 'test-secret-key',
  })
  response = { MessageId: 'receipt-1', $metadata: { requestId: 'request-1' } }
  failure = undefined
  messages.length = 0
  info.mockClear()
  error.mockClear()
  log.mockClear()
})
afterAll(() => {
  for (const [name, value] of Object.entries(originalGlobals)) {
    if (value === undefined) Reflect.deleteProperty(globalThis, name)
    else (globalThis as any)[name] = value
  }
  for (const [name, value] of Object.entries(originalEnv)) {
    if (value === undefined) Reflect.deleteProperty(process.env, name)
    else process.env[name] = value
  }
  info.mockRestore()
  error.mockRestore()
  log.mockRestore()
  mock.restore()
})
const options = { to: 'owner@firma.cz', code: '123456', name: 'Owner' }

test('returns the SES receipt and logs acceptance without credentials', async () => {
  expect(await send(options)).toEqual({ delivery: 'ses', messageId: 'receipt-1' })
  expect(messages).toHaveLength(1)
  expect(info).toHaveBeenCalledWith('[SES] Verification email accepted:', {
    messageId: 'receipt-1',
    region: 'eu-central-1',
    requestId: 'request-1',
  })
  expect(JSON.stringify(info.mock.calls)).not.toContain('test-secret-key')
})
test('fails in production when credentials are missing', async () => {
  delete process.env.SES_ACCESS_KEY_ID
  delete process.env.SES_SECRET_ACCESS_KEY
  await expect(send(options)).rejects.toMatchObject({ statusCode: 500 })
  expect(messages).toHaveLength(0)
})
test('does not report acceptance when SES rejects the email', async () => {
  failure = new Error('Rejected')
  await expect(send(options)).rejects.toMatchObject({ statusCode: 500 })
  expect(info).not.toHaveBeenCalled()
})
test('does not report acceptance without a message ID', async () => {
  response = { $metadata: {} }
  await expect(send(options)).rejects.toMatchObject({ statusCode: 500 })
  expect(info).not.toHaveBeenCalled()
})
test('reports development delivery explicitly without sending email', async () => {
  delete process.env.SES_ACCESS_KEY_ID
  delete process.env.SES_SECRET_ACCESS_KEY
  expect(await devSend(options)).toEqual({ delivery: 'development' })
  expect(messages).toHaveLength(0)
  expect(log.mock.calls[0]![0]).toContain('[DEV EMAIL]')
})
