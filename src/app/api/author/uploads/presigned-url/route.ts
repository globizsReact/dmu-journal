
import { type NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { verifyToken } from '@/lib/authUtils';
import { toDbUrl } from '@/lib/urlUtils';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables at runtime
    const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;

    const missingVars = [
        !AWS_REGION && "AWS_REGION",
        !AWS_ACCESS_KEY_ID && "AWS_ACCESS_KEY_ID",
        !AWS_SECRET_ACCESS_KEY && "AWS_SECRET_ACCESS_KEY",
        !AWS_BUCKET_NAME && "AWS_BUCKET_NAME"
    ].filter(Boolean).join(', ');

    if (missingVars) {
        const errorMsg = `Server configuration error: The following AWS environment variables are missing: ${missingVars}.`;
        console.error("S3 Upload Error:", errorMsg);
        return NextResponse.json({ error: 'Server configuration error: Missing AWS credentials. Please contact an administrator.' }, { status: 500 });
    }

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    // Allow any authenticated user (author in this context) to upload.
    // The manuscript submission process itself is guarded by author role.
    if (!decoded) {
      return NextResponse.json({ error: 'Forbidden: Valid token required' }, { status: 403 });
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
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Generate unique, date-based key for the assets folder
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const uniqueSuffix = randomUUID();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    const key = `assets/${year}/${month}/${uniqueSuffix}-${sanitizedFilename}`;
    
    // Upload directly to S3
    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    
    const cloudfrontUrl = "https://diuu569ds96wh.cloudfront.net";
    const fullPublicUrl = `${cloudfrontUrl}/${key}`;

    // Convert to the "clean" URL for database storage
    const dbUrl = toDbUrl(fullPublicUrl);
    
    console.log('File uploaded by author. Full URL:', fullPublicUrl, 'DB URL:', dbUrl);

    return NextResponse.json({
      success: true,
      publicUrl: dbUrl, // Return the clean URL
      location: dbUrl,
      key: key
    });

  } catch (error) {
    console.error('Error uploading file for author:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to upload file', details: errorMessage }, { status: 500 });
  }
}
