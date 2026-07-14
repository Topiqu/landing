import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

interface SendVerificationCodeOptions {
  to: string
  code: string
  name: string
  language?: string
}

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

export async function sendVerificationCode({ to, code, name }: SendVerificationCodeOptions) {
  const config = useRuntimeConfig() as any
  const from = config.emailFrom || 'Topiqu <noreply@topiqu.com>'
  const client = getSesClient()

  if (!client) {
    if (import.meta.dev) {
      console.log(`[DEV EMAIL] Verification code for ${to}: ${code}`)
      return
    }
    throw createError({ statusCode: 500, message: 'Email service not configured' })
  }

  try {
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: from,
        Destination: { ToAddresses: [to] },
        Content: {
          Simple: {
            Subject: { Data: `${code} is your Topiqu verification code`, Charset: 'UTF-8' },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin-bottom:8px">Hello${name ? ` ${name}` : ''},</h2>
          <p style="color:#555">Your Topiqu verification code is:</p>
          <div style="font-size:36px;font-weight:900;letter-spacing:0.5em;background:#f4f4f5;padding:24px;border-radius:12px;text-align:center;margin:24px 0">${code}</div>
          <p style="color:#888;font-size:13px">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
              },
            },
          },
        },
      }),
    )
  } catch (err: any) {
    // Surface the real SES failure (bad creds, unverified sender, region
    // mismatch, throttling…) in the server logs, then return a generic error.
    console.error('[SES] sendVerificationCode failed:', err?.name, '-', err?.message)
    throw createError({ statusCode: 500, message: 'Failed to send verification email' })
  }
}
