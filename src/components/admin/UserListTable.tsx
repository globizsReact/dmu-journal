
'use client';

import { useState, useEffect } from 'react';
import type { User } from '@prisma/client'; // Assuming User type is available
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, Pencil, Trash2, Eye } from 'lucide-react'; // Added Pencil, Trash2
import { format, isValid } from 'date-fns';

// Minimal User type for display, adjust as needed from Prisma schema
interface DisplayUser {
  id: number;
  fullName: string | null;
  username: string;
  email: string;
  role: string | null;
  createdAt: Date;
}

export default function UserListTable() {
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    if (!authToken) {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch users: ${response.statusText} (Status: ${response.status})`);
        }
        const data: DisplayUser[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching users for admin:", err);
        setError(err.message || "An unexpected error occurred.");
        toast({
          title: "Error Fetching Users",
          description: err.message || "Could not load user list.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [authToken, toast]);

  const formatDisplayDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'PP') : 'Invalid Date'; // Shorter date format
    } catch {
      return 'Error';
    }
  };

  const handleEditUser = (userId: number) => {
    // Placeholder for edit functionality
    toast({ title: "Edit User", description: `Edit functionality for user ID ${userId} is not yet implemented.`});
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = (userId: number) => {
    // Placeholder for delete functionality
    toast({ title: "Delete User", description: `Delete functionality for user ID ${userId} is not yet implemented.`, variant: "destructive"});
    console.log("Delete user:", userId);
  };


  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Users</CardTitle>
          <CardDescription>Manage user accounts in the system.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading users...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg mb-2">Failed to Load Users</p>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (users.length === 0) {
     return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Users</CardTitle>
          <CardDescription>Manage user accounts in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 text-center py-8">No users found in the system.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary">All Users</CardTitle>
        <CardDescription>Manage user accounts. Found {users.length} user(s).</CardDescription>
        {/* TODO: Add "Add New User" button here later */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">User ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.fullName || 'N/A'}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span 
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize
                            ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                              user.role === 'reviewer' ? 'bg-yellow-100 text-yellow-700' :
                              user.role === 'author' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'}`}
                    >
                        {user.role || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDisplayDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleEditUser(user.id)}
                        title="Edit User (Coming Soon)"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span className="sr-only">Edit User</span>
                    </Button>
                     <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User (Coming Soon)"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Delete User</span>
                    </Button>
                    {/* Potentially a View Details button if needed */}
                    {/* <Button variant="ghost" size="icon" className="h-7 w-7" title="View Details (Coming Soon)"><Eye className="w-3.5 h-3.5" /></Button> */}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
