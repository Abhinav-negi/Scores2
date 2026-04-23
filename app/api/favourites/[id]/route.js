import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Favourite from '@/models/Favourite';
import { verifyTokenNode } from '@/lib/auth/jwt';

// Helper to authenticate the request
function authenticate(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return verifyTokenNode(token);
}

export async function DELETE(request, { params }) {
  try {
    const userPayload = authenticate(request);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Favourite ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    // We must ensure the user can only delete their OWN favourites
    const result = await Favourite.findOneAndDelete({ 
      _id: id, 
      userId: userPayload.userId 
    });

    if (!result) {
      return NextResponse.json({ error: 'Favourite not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favourite removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Favourite Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
