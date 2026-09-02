import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  const rawUri = process.env.MONGODB_URI || 'mongodb+srv://skyrellac:skyrellac123@cluster0.mongodb.net/skyrellac?retryWrites=true&w=majority';
  const cleanUri = rawUri.replace(/wmode=/g, 'w=');

  const results: any = {
    rawUri: cleanUri.replace(/:([^@]+)@/, ':****@'),
    mongooseState: mongoose.connection.readyState,
  };

  try {
    const start = Date.now();
    await mongoose.connect(cleanUri, { serverSelectionTimeoutMS: 5000 });
    results.connectionTimeMs = Date.now() - start;
    results.status = 'SUCCESS';
    results.dbName = mongoose.connection.db?.databaseName;
    
    // Try inserting a test user document
    const testCol = mongoose.connection.db?.collection('users');
    const insertRes = await testCol?.insertOne({
      fullName: 'Atlas Test User',
      email: 'test_' + Date.now() + '@skyrellac.com',
      createdAt: new Date(),
    });
    results.testInsertId = insertRes?.insertedId;
  } catch (err: any) {
    results.status = 'FAILED';
    results.error = err.message;
    results.errorName = err.name;
    results.stack = err.stack;
  }

  return NextResponse.json(results);
}
