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

export async function GET(request) {
  try {
    const userPayload = authenticate(request);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch all favourites for this user
    const favourites = await Favourite.find({ userId: userPayload.userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ data: favourites }, { status: 200 });
  } catch (error) {
    console.error('Fetch Favourites Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userPayload = authenticate(request);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const body = await request.json();
    const { sport, type, externalId, name } = body;

    if (!sport || !type || !externalId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to create the favourite. The model has a compound unique index,
    // so if it already exists, Mongoose will throw a duplicate key error (code 11000).
    const favourite = await Favourite.create({
      userId: userPayload.userId,
      sport,
      type,
      externalId,
      name,
    });

    return NextResponse.json({ data: favourite }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Already favourited' }, { status: 409 });
    }
    console.error('Create Favourite Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
