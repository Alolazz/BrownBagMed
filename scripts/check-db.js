// Script to check database connection and content
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Checking database connection...');
  
  try {
    // Check connection
    await prisma.$connect();
    console.log('Database connection successful!');
    
    // Check for patients
    const patientCount = await prisma.patient.count();
    console.log(`Found ${patientCount} patients in the database.`);
    
    if (patientCount > 0) {
      const patients = await prisma.patient.findMany({
        take: 5,
        orderBy: { uploadedAt: 'desc' }
      });
      
      console.log('Latest patients:');
      patients.forEach(p => {
        console.log(`- ID: ${p.id}, DOB: ${p.dateOfBirth || 'N/A'}, Uploaded: ${p.uploadedAt}`);
      });
    } else {
      console.log('No patients found in the database.');
      
      // Try to create a test patient
      console.log('Creating a test patient...');
      const testPatient = await prisma.patient.create({
        data: {
          id: `test-${Date.now()}`,
          folderName: `test-folder-${Date.now()}`,
          dateOfBirth: '2000-01-01',
          gender: 'Not specified',
          conditions: 'Test condition',
          allergies: 'Test allergy',
          comments: 'Test comment',
          uploadedAt: new Date(),
          reportReady: false,
          paid: false
        }
      });
      
      console.log('Test patient created:', testPatient);
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
