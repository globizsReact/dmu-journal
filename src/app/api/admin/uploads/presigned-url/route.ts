
import { type NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { verifyToken } from '@/lib/authUtils';
import { randomUUID } from 'crypto';

// Basic check for S3 environment variables
if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
  console.error("S3 Upload Error: Missing required AWS environment variables.");
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
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
     if (!process.env.AWS_BUCKET_NAME) {
      throw new Error("S3 bucket name is not configured on the server.");
    }

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
      ACL: 'public-read', // Make the object publicly accessible
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // URL expires in 5 minutes

    // The public URL to access the file after upload
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      uploadUrl: presignedUrl,
      publicUrl: publicUrl, // This is the URL to store in the database
    });

  } catch (error) {
    console.error('Error creating presigned URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create presigned URL', details: errorMessage }, { status: 500 });
  }
}
