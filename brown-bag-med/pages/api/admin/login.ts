import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const cookie = serialize('admin_auth', 'true', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 12, // 12 hours
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    res.setHeader('Set-Cookie', cookie)
    res.status(200).json({ success: true })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
}
