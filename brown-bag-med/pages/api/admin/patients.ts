import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs-extra'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dir = path.join(process.cwd(), 'uploads')
  const folders = await fs.readdir(dir)
  const patients = folders.filter(f => f.startsWith('patient_'))
  res.status(200).json({ patients })
}
