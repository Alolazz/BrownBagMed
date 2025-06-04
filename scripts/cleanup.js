const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const DAYS_OLD = 90;

async function cleanupUploads() {
  const now = Date.now();
  const cutoff = now - DAYS_OLD * 24 * 60 * 60 * 1000;
  const entries = await fs.readdir(UPLOADS_DIR);
  for (const entry of entries) {
    if (!entry.startsWith('patient_')) continue;
    const fullPath = path.join(UPLOADS_DIR, entry);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory() && stat.mtimeMs < cutoff) {
      await fs.remove(fullPath);
    }
  }
}

// Run once immediately if called directly
if (require.main === module) {
  cleanupUploads().catch(console.error);
}

// Schedule daily at 02:00
cron.schedule('0 2 * * *', () => {
  cleanupUploads().catch(console.error);
});
