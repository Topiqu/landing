import type { H3Event } from 'h3'

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

import { onboardingLog } from './onboardingLog'

interface SendVerificationCodeOptions {
  to: string
  code: string
  name: string
  locale?: 'cs' | 'en'
  link?: string
  event?: H3Event
}

type VerificationEmailDelivery = { delivery: 'ses'; messageId: string } | { delivery: 'development' }

let sesClient: SESv2Client | undefined

function getSesClient(): SESv2Client | undefined {
  // Read credentials from process.env at runtime (works on Vercel regardless of
  // build-time baking) and fall back to runtimeConfig. We deliberately use
  // SES_-prefixed names, NOT AWS_*: on Vercel (Lambda) the AWS_REGION /
  // AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY names are reserved and overwritten
  // by the runtime's own execution role + function region (us-east-1), which
  // would send to the wrong region and with the wrong credentials.
  const cfg = (useRuntimeConfig() as any).aws ?? {}
  const region = process.env.SES_REGION || cfg.region || 'eu-central-1'
  const accessKeyId = process.env.SES_ACCESS_KEY_ID || cfg.accessKeyId
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY || cfg.secretAccessKey
  if (!accessKeyId || !secretAccessKey) return undefined
  if (!sesClient) {
    sesClient = new SESv2Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })
  }
  return sesClient
}

const COPY = {
  en: {
    subject: (code: string) => `${code} is your Topiqu verification code`,
    greeting: (name: string) => `Hello${name ? ` ${name}` : ''},`,
    intro: 'Your Topiqu verification code is:',
    button: 'Verify automatically',
    manual: 'or enter the code above manually.',
    footer: 'This code expires in 15 minutes. If you did not request it, you can safely ignore this email.',
  },
  cs: {
    subject: (code: string) => `${code} je váš ověřovací kód pro Topiqu`,
    greeting: (name: string) => `Dobrý den${name ? `, ${name}` : ''},`,
    intro: 'Váš ověřovací kód pro Topiqu:',
    button: 'Ověřit automaticky',
    manual: 'nebo kód výše zadejte ručně.',
    footer: 'Kód platí 15 minut. Pokud jste o něj nežádali, můžete tento e-mail ignorovat.',
  },
} as const

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

export async function sendVerificationCode({
  to,
  code,
  name,
  locale = 'en',
  link,
  event,
}: SendVerificationCodeOptions): Promise<VerificationEmailDelivery> {
  const config = useRuntimeConfig() as any
  const from = config.emailFrom || 'Topiqu <noreply@topiqu.com>'
  const client = getSesClient()
  const copy = COPY[locale]

  if (!client) {
    if (import.meta.dev) {
      console.log(`[DEV EMAIL] Verification code for ${to}: ${code}${link ? ` | link: ${link}` : ''}`)
      return { delivery: 'development' }
    }
    onboardingLog(event, 'email.failed', { dependency: 'ses', status: 500, outcome: 'missing_configuration' })
    throw createError({ statusCode: 500, message: 'Email service not configured' })
  }

  try {
    const result = await client.send(
      new SendEmailCommand({
        FromEmailAddress: from,
        Destination: { ToAddresses: [to] },
        Content: {
          Simple: {
            Subject: { Data: copy.subject(code), Charset: 'UTF-8' },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `
        <div style="font-family:Manrope,'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;color:#0f172a">
          <h2 style="margin:0 0 8px;font-size:22px">${escapeHtml(copy.greeting(name))}</h2>
          <p style="color:#475569;margin:0">${copy.intro}</p>
          <div style="font-size:34px;font-weight:800;letter-spacing:0.4em;background:#eef2ff;color:#312e81;padding:22px;border-radius:14px;text-align:center;margin:24px 0">${code}</div>
          ${
            link
              ? `<p style="text-align:center;margin:24px 0">
          <a href="${escapeHtml(link)}" style="display:inline-block;background:#4338ca;color:#fff;text-decoration:none;font-weight:700;padding:13px 26px;border-radius:10px">${copy.button} &rarr;</a>
        </p>
        <p style="color:#64748b;font-size:13px;text-align:center">${copy.manual}</p>`
              : ''
          }
          <p style="color:#64748b;font-size:13px">${copy.footer}</p>
        </div>
      `,
              },
            },
          },
        },
      }),
    )
    if (!result.MessageId) throw new Error('SES did not return a message ID')
    onboardingLog(event, 'email.accepted', {
      dependency: 'ses',
      status: 200,
      messageId: result.MessageId,
      region: await client.config.region(),
      providerRequestId: result.$metadata.requestId,
    })
    return { delivery: 'ses', messageId: result.MessageId }
  } catch (error) {
    // Provider messages can contain recipient information. Log only a safe outcome.
    const code = error instanceof Error ? error.name : ''
    const outcome = [
      'MessageRejected',
      'MailFromDomainNotVerifiedException',
      'TooManyRequestsException',
      'AccessDeniedException',
      'UnrecognizedClientException',
      'CredentialsProviderError',
      'TimeoutError',
    ].includes(code)
      ? code
      : 'provider_error'
    onboardingLog(event, 'email.failed', { dependency: 'ses', status: 502, outcome })
    throw createError({ statusCode: 500, message: 'Failed to send verification email' })
  }
}
