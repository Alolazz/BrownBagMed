#!/usr/bin/env node
// filepath: /mnt/Aly/brown-bag-med/Brown-Bag-1/scripts/create-test-patient.js

/**
 * Script to create a test patient for payment flow testing
 * Run with: node scripts/create-test-patient.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestPatient() {
  try {
    console.log('Creating test patient for payment flow testing...');
    
    // Create or update test patient
    const patient = await prisma.patient.upsert({
      where: {
        id: 'test-payment-patient'
      },
      update: {
        folderName: 'TestPaymentPatient',
        dateOfBirth: '1990-01-01',
        gender: 'Other',
        conditions: JSON.stringify(['Test Condition 1', 'Test Condition 2']),
        allergies: 'None',
        comments: 'This is a test patient for payment flow testing',
        reportReady: true,
        medications: 'Medication A, Medication B, Medication C'
      },
      create: {
        id: 'test-payment-patient',
        folderName: 'TestPaymentPatient',
        dateOfBirth: '1990-01-01',
        gender: 'Other',
        conditions: JSON.stringify(['Test Condition 1', 'Test Condition 2']),
        allergies: 'None',
        comments: 'This is a test patient for payment flow testing',
        reportReady: true,
        medications: 'Medication A, Medication B, Medication C'
      }
    });
    
    console.log('Test patient created/updated successfully:');
    console.log(`- ID: ${patient.id}`);
    console.log(`- Name: ${patient.folderName}`);
    console.log('');
    console.log('Use this patient ID in your tests:');
    console.log(`const testPatientId = '${patient.id}';`);
    
  } catch (error) {
    console.error('Error creating test patient:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPatient();
