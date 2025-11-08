import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Check authentication using admin_session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalSize = buffer.length;

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const nameWithoutExt = path.parse(safeName).name;
    const filename = `${nameWithoutExt}-${timestamp}.webp`;

    // Determine upload directory (use 'uploads' for admin uploads)
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    // Process image with sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Convert to WebP with quality settings
    const webpBuffer = await image
      .webp({
        quality: 85, // Good balance between quality and size
        effort: 6,   // Compression effort (0-6, higher = better compression but slower)
      })
      .toBuffer();

    // Save the file
    await writeFile(filepath, new Uint8Array(webpBuffer));

    const webpSize = webpBuffer.length;
    const savings = Math.round(((originalSize - webpSize) / originalSize) * 100);

    // Return the URL and image info
    const imageUrl = `/images/uploads/${filename}`;
    
    return NextResponse.json({
      url: imageUrl,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: webpSize,
      originalSize: originalSize,
      savings: savings,
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
