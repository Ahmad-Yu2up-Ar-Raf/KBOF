// src/lib/server/send-magic-link.ts - FINAL VERSION
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY as string)

interface SendMagicLinkParams {
  email: string
  url: string
  token: string
}

export async function sendMagicLinkEmail({
  email,
  url,
  token,
}: SendMagicLinkParams) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set')
      throw new Error('Email service not configured')
    }

    console.log('📧 Sending magic link to:', email)

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Suasana</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🌴 Suasana</h1>
  </div>
  
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Verify your email</h2>
    <p style="color: #4b5563; font-size: 16px;">
      Klik tombol di bawah untuk masuk ke akun Suasana kamu.
    </p>
    
    <div style="text-align: center; margin: 35px 0;">
      <a href="${url}" 
         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: 600;
                display: inline-block;
                font-size: 16px;">
        🔑 Masuk ke Suasana
      </a>
    </div>
    
  
    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">
        ⏱️ Link ini akan <strong>kadaluarsa dalam 15 menit</strong> dan hanya bisa digunakan sekali.
      </p>
      <p style="color: #9ca3af; font-size: 13px; margin-top: 10px;">
        Kalau kamu tidak meminta email ini, abaikan saja.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Suasana - Platform Ekowisata & Budaya Indonesia</p>
  </div>
</body>
</html>
    `.trim()

    const textContent = `
🌴 Suasana - Verify Your Email

Klik link di bawah untuk masuk:
${url}

Link ini akan kadaluarsa dalam 15 menit dan hanya bisa digunakan sekali.

Kalau kamu tidak meminta email ini, abaikan saja.

© ${new Date().getFullYear()} Suasana
    `.trim()

    // ✅ PAKAI DOMAIN RESEND (GRATIS SELAMANYA!)
    const result = await resend.emails.send({
      from: 'Suasana <onboarding@resend.dev>', // ✅ FREE FOREVER
      to: email,
      subject: '🔑 Magic Link - Masuk ke Suasana',
      html: htmlContent,
      text: textContent,
    })

    console.log('✅ Magic link sent successfully!')
    console.log('📧 Resend ID:', result.data?.id)

    return { success: true, data: result }
  } catch (error) {
    console.error('❌ Failed to send magic link:', error)
    throw new Error('Failed to send magic link email')
  }
}
