
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authUtils';
import { z } from 'zod';

const updateUserSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
    .optional(),
  email: z.string().email('Invalid email address.').optional(),
  role: z.enum(['admin', 'author', 'reviewer']).optional(),
  // Password updates should be handled separately or with more security considerations by admin
});

// GET a single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
  }

  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, username: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });

  } catch (error: any) {
    console.error(`Admin User API (GET /${userId}): General error:`, error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the user.', details: error.message },
      { status: 500 }
    );
  }
}


// PUT (update) a user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userIdToUpdate = parseInt(params.id, 10);
   if (isNaN(userIdToUpdate)) {
    return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
  }

  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input data.', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { fullName, username, email, role } = validation.data;

    // Check for username/email conflicts with OTHER users
    if (username) {
        const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUserByUsername && existingUserByUsername.id !== userIdToUpdate) {
          return NextResponse.json({ error: 'Username already taken by another user.' }, { status: 409 });
        }
    }
    if (email) {
        const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingUserByEmail && existingUserByEmail.id !== userIdToUpdate) {
          return NextResponse.json({ error: 'Email already taken by another user.' }, { status: 409 });
        }
    }
    
    const dataToUpdate: any = {};
    if (fullName) dataToUpdate.fullName = fullName;
    if (username) dataToUpdate.username = username;
    if (email) dataToUpdate.email = email;
    if (role) dataToUpdate.role = role;

    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ error: 'No fields provided for update.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdToUpdate },
      data: dataToUpdate,
      select: { id: true, fullName: true, username: true, email: true, role: true },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error: any) {
    console.error(`Admin User API (PUT /${userIdToUpdate}): General error:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found for update' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating the user.', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE a user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userIdToDelete = parseInt(params.id, 10);
  if (isNaN(userIdToDelete)) {
    return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
  }

  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Prevent admin from deleting their own account via this route
    if (decodedToken.userId === userIdToDelete) {
        return NextResponse.json({ error: 'Admin cannot delete their own account through this interface.' }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: userIdToDelete },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error(`Admin User API (DELETE /${userIdToDelete}): General error:`, error);
    if (error.code === 'P2025') { // Record to delete not found
      return NextResponse.json({ error: 'User not found for deletion' }, { status: 404 });
    }
    if (error.code === 'P2003') { // Foreign key constraint failed
        return NextResponse.json({ error: 'Cannot delete user. They may have submitted manuscripts or other associated data.' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the user.', details: error.message },
      { status: 500 }
    );
  }
}
    