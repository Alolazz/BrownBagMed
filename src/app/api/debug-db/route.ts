import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force environment variables to be loaded
if (process.env.DATABASE_URL?.startsWith('file:')) {
  console.log('⚠️ Using SQLite database!');
} else if (process.env.DATABASE_URL?.startsWith('prisma+postgres:')) {
  console.log('✅ Using PostgreSQL database!');
} else {
  console.log('❓ Unknown database type:', process.env.DATABASE_URL?.substring(0, 20));
}

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const patients = await prisma.patient.findMany({
      take: 5,
      orderBy: { uploadedAt: 'desc' },
    });
    
    console.log(`Found ${patients.length} patients`);
    patients.forEach(p => {
      console.log(`- ID: ${p.id.substring(0, 8)}... | Has medications: ${p.medications ? 'Yes' : 'No'}`);
    });
    
    return NextResponse.json({ 
      count: patients.length, 
      dbType: process.env.DATABASE_URL?.startsWith('file:') ? 'SQLite' : 'PostgreSQL',
      dbUrl: process.env.DATABASE_URL?.substring(0, 20) + '...'
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
