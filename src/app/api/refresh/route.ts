import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * API route handler for manually refreshing cached data
 * Use this endpoint to clear Next.js cache for specific paths
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '/alola';
  
  try {
    // Revalidate the specified path or default to '/alola'
    revalidatePath(path);
    
    return NextResponse.json({ 
      success: true, 
      message: `Cache cleared for path: ${path}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error revalidating path:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to revalidate path' 
    }, { status: 500 });
  }
}
