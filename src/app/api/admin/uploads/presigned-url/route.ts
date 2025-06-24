
import { type NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { verifyToken } from '@/lib/authUtils';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables at runtime and provide specific errors
    const missingVars = [];
    if (!process.env.AWS_REGION) missingVars.push('AWS_REGION');
    if (!process.env.AWS_ACCESS_KEY_ID) missingVars.push('AWS_ACCESS_KEY_ID');
    if (!process.env.AWS_SECRET_ACCESS_KEY) missingVars.push('AWS_SECRET_ACCESS_KEY');
    if (!process.env.AWS_BUCKET_NAME) missingVars.push('AWS_BUCKET_NAME');

    if (missingVars.length > 0) {
      const errorMessage = `Server configuration error: The following AWS environment variables are missing: ${missingVars.join(', ')}. Please check your .env.local file and restart the server.`;
      console.error(errorMessage);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { filename, contentType } = await request.json();
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Filename and contentType are required' }, { status: 400 });
    }

    // Initialize S3 Client inside the handler to ensure env vars are loaded
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const uniqueSuffix = randomUUID();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    const key = `uploads/${year}/${month}/${day}/${uniqueSuffix}-${sanitizedFilename}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // URL expires in 5 minutes

    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      uploadUrl: presignedUrl,
      publicUrl: publicUrl,
    });

  } catch (error) {
    console.error('Error creating presigned URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create presigned URL', details: errorMessage }, { status: 500 });
  }
}
