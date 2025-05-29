import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
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

  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true, multiples: false })

  let savedFilePath = ''

  form.on('file', (field, file: File) => {
    // Move/rename the uploaded file to 'report.pdf'
    const destPath = path.join(uploadDir, 'report.pdf')
    fs.moveSync(file.filepath, destPath, { overwrite: true })
    savedFilePath = destPath
  })

  form.parse(req, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed' })
    }
    if (!savedFilePath) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    res.status(200).json({ message: 'Report uploaded successfully' })
  })
}