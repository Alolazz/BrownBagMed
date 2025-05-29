import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs-extra'
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const patientId = req.query.patientId as string
  if (!patientId) return res.status(400).json({ error: 'Missing patient ID' })

  const uploadDir = path.join(process.cwd(), 'uploads', patientId)
  await fs.ensureDir(uploadDir)

  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true })

  form.onPart = part => {
    if (part.filename) {
      const filePath = path.join(uploadDir, 'report.pdf')
      part.pipe(fs.createWriteStream(filePath))
    } else {
      part.resume()
    }
  }

  form.parse(req, () => {
    res.status(200).json({ message: 'Report uploaded successfully' })
  })
}
