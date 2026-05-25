interface SendVerificationCodeOptions {
  to: string
  code: string
  name: string
  language?: string
}

export async function sendVerificationCode({ to, code, name }: SendVerificationCodeOptions) {
  const config = useRuntimeConfig() as any
  const apiKey = config.resendApiKey
  const from = config.emailFrom || 'Topiqu <noreply@topiqu.com>'

  if (!apiKey) {
    if (import.meta.dev) {
      console.log(`[DEV EMAIL] Verification code for ${to}: ${code}`)
      return
    }
    throw createError({ statusCode: 500, message: 'Email service not configured' })
  }

  await $fetch<unknown>('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: {
      from,
      to: [to],
      subject: `${code} is your Topiqu verification code`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin-bottom:8px">Hello${name ? ` ${name}` : ''},</h2>
          <p style="color:#555">Your Topiqu verification code is:</p>
          <div style="font-size:36px;font-weight:900;letter-spacing:0.5em;background:#f4f4f5;padding:24px;border-radius:12px;text-align:center;margin:24px 0">${code}</div>
          <p style="color:#888;font-size:13px">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    },
  })
}
