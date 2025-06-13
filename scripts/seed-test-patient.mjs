import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Creating test patient...');
    
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
        reportReady: true,
        paid: false
      }
    });
    
    console.log('Test patient created successfully:', testPatient);
  } catch (error) {
    console.error('Error creating test patient:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
