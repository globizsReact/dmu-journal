
import { type NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { verifyToken } from '@/lib/authUtils';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  console.log('Environment check:');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set');
  console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);

  try {
    // Check for required environment variables at runtime
    const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_BUCKET_NAME) {
      console.error("S3 Upload Error: One or more required AWS environment variables are missing on the server.");
      return NextResponse.json({ error: 'Server configuration error: Missing AWS credentials. Please contact an administrator.' }, { status: 500 });
    }

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Parse form data to get the actual file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Initialize S3 Client
    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // Generate unique key
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const uniqueSuffix = randomUUID();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    const key = `uploads/${year}/${month}/${day}/${uniqueSuffix}-${sanitizedFilename}`;
    
    // Upload directly to S3
    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Make the object publicly accessible
    });

    // Execute the upload
    await s3Client.send(command);
    
    // Generate the public URL
    const publicUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    console.log('File uploaded successfully:', publicUrl);

    return NextResponse.json({
      success: true,
      publicUrl: publicUrl,
      location: publicUrl,
      key: key
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to upload file', details: errorMessage }, { status: 500 });
  }
}
