
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@prisma/client'; // Assuming User type is still relevant
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
import { Loader2, AlertTriangle, Pencil, Trash2, UserPlus, ChevronLeft, ChevronRight, CheckCircle2, MoreVertical } from 'lucide-react';
import AddUserDialog from '@/components/admin/dialogs/AddUserDialog';
import EditUserDialog from '@/components/admin/dialogs/EditUserDialog';
import DeleteUserConfirmationDialog from '@/components/admin/dialogs/DeleteUserConfirmationDialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DisplayUser {
  id: number;
  fullName: string | null;
  username: string;
  email: string;
  role: string | null;
}

interface ApiResponse {
  users: DisplayUser[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function UserListTable() {
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Items per page

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DisplayUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<DisplayUser | null>(null);
  const [approvingUserId, setApprovingUserId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);
      if (!token) { // Initial check if token is immediately unavailable
        setIsLoading(false);
        setError("Authentication token not found. Please log in.");
        setUsers([]);
      }
    }
  }, []);

  const fetchUsers = useCallback(async (page: number) => {
    if (!authToken) {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      setUsers([]); 
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('authorName');
                window.dispatchEvent(new CustomEvent('authChange'));
            }
            return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch users: ${response.statusText}`);
      }
      const data: ApiResponse = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err: any) {
      console.error("Error fetching users for admin:", err);
      setError(err.message || "An unexpected error occurred.");
      toast({
        title: "Error Fetching Users",
        description: err.message || "Could not load user list.",
        variant: "destructive",
      });
      setUsers([]); 
    } finally {
      setIsLoading(false);
    }
  }, [authToken, limit, toast]);

  useEffect(() => {
    if (authToken) {
      fetchUsers(currentPage);
    } else {
      setIsLoading(false);
      setError("Authentication token not found. Please log in.");
      setUsers([]);
    }
  }, [currentPage, authToken, fetchUsers]);

  const handleApproveUser = async (userToApprove: DisplayUser) => {
    if (!authToken) {
        toast({ title: 'Authentication Error', description: 'Cannot perform action.', variant: 'destructive'});
        return;
    }
    setApprovingUserId(userToApprove.id);
    try {
        const response = await fetch(`/api/admin/users/${userToApprove.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ role: 'reviewer' }),
        });

        const data = await response.json();
        if (response.ok) {
            toast({ title: 'User Approved', description: `${userToApprove.username} is now a verified reviewer.` });
            fetchUsers(currentPage); // Refetch to show updated status
        } else {
            throw new Error(data.error || 'Failed to approve user.');
        }
    } catch (err: any) {
        toast({ title: 'Approval Failed', description: err.message, variant: 'destructive' });
    } finally {
        setApprovingUserId(null);
    }
  };


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleUserAdded = (newUser: DisplayUser) => {
    fetchUsers(1); 
    toast({ title: "User Added", description: `${newUser.fullName || newUser.username} has been successfully added.` });
  };
  
  const handleUserUpdated = (updatedUser: DisplayUser) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast({ title: "User Updated", description: `${updatedUser.fullName || updatedUser.username}'s details have been updated.` });
  };

  const handleUserDeleted = (deletedUserId: number) => {
    const newPage = users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
    if (currentPage !== newPage) {
      setCurrentPage(newPage);
    } else {
      fetchUsers(newPage); 
    }
    toast({ title: "User Deleted", description: "The user has been successfully deleted.", variant: 'default' });
  };

  if (isLoading && users.length === 0 && !error && authToken) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex-grow">
                <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">All Users</CardTitle>
                <CardDescription>Manage user accounts.</CardDescription>
            </div>
            <Button disabled className="w-full sm:w-auto"><UserPlus className="mr-2 h-4 w-4" /> Add User</Button>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading users...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive text-lg mb-2">Failed to Load Users</p>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-grow">
            <CardTitle className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-primary">All Users</CardTitle>
            <CardDescription>Manage user accounts. Reviewers must be verified before they can log in. Showing page {currentPage} of {totalPages}.</CardDescription>
          </div>
          <Button onClick={() => setIsAddUserDialogOpen(true)} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        )}
        {!isLoading && !error && users.length === 0 && (
          <p className="text-foreground/80 text-center py-8">No users found.</p>
        )}
        {!isLoading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status / Action</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                        className={cn(`px-2 py-0.5 text-xs font-semibold rounded-full capitalize
                          ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'reviewer' || user.role === 'reviewer_inactive' ? 'bg-yellow-100 text-yellow-700' :
                            user.role === 'author' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'}`)}
                      >
                        {user.role === 'reviewer_inactive' ? 'Reviewer' : user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                        {user.role === 'reviewer_inactive' && (
                            <Button 
                                onClick={() => handleApproveUser(user)} 
                                size="sm" 
                                disabled={approvingUserId === user.id || isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs"
                            >
                                {approvingUserId === user.id ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                                Approve
                            </Button>
                        )}
                        {user.role === 'reviewer' && (
                            <Badge variant="secondary" className="border-green-600 text-green-700 bg-green-100 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1"/>
                                Verified
                            </Badge>
                        )}
                         {user.role === 'author' && (
                           <Badge variant="secondary">N/A</Badge>
                        )}
                         {user.role === 'admin' && (
                           <Badge variant="secondary" className="border-red-600 text-red-700 bg-red-100">System Admin</Badge>
                        )}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setEditingUser(user)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit User</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingUser(user)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete User</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 py-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="w-full sm:w-auto"
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>

      {isAddUserDialogOpen && (
        <AddUserDialog
          isOpen={isAddUserDialogOpen}
          onClose={() => setIsAddUserDialogOpen(false)}
          onUserAdded={handleUserAdded}
          authToken={authToken || ''}
        />
      )}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
          authToken={authToken || ''}
        />
      )}
      {deletingUser && (
        <DeleteUserConfirmationDialog
          user={deletingUser}
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onUserDeleted={handleUserDeleted}
          authToken={authToken || ''}
        />
      )}
    </Card>
  );
}
