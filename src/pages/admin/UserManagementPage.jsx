import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
} from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import { getUsers, deleteUser, banUser } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import {
  Search,
  MoreVertical,
  Ban,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield,
} from 'lucide-react';

const UserManagementPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        role: roleFilter === 'all' ? undefined : roleFilter,
      };
      const response = await getUsers(params);
      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Mock data
      setUsers([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'job_seeker',
          status: 'active',
          created_at: '2024-01-15',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'employer',
          status: 'active',
          created_at: '2024-01-20',
        },
        {
          id: '3',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob@example.com',
          role: 'job_seeker',
          status: 'suspended',
          created_at: '2024-02-01',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (user, type) => {
    setSelectedUser(user);
    setActionDialog({ open: true, type });
  };

  const executeAction = async () => {
    if (!selectedUser) return;

    try {
      switch (actionDialog.type) {
        case 'ban':
          await banUser(selectedUser.id, { reason: 'Violation of terms' });
          break;
        case 'delete':
          await deleteUser(selectedUser.id);
          break;
      }
      fetchUsers();
      setActionDialog({ open: false, type: null });
      setSelectedUser(null);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const classes = {
      active: themeColors.status.active,
      suspended: themeColors.status.suspended,
      banned: themeColors.status.rejected,
      inactive: themeColors.status.inactive,
    };
    return (
      <Badge className={classes[status] || classes.inactive}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role) => {
    return (
      <Badge variant="outline">
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>User Management</h2>
        <p className={themeColors.text.secondary}>
          Manage all platform users and their access
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={roleFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={roleFilter === 'job_seeker' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('job_seeker')}
                size="sm"
              >
                Job Seekers
              </Button>
              <Button
                variant={roleFilter === 'employer' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('employer')}
                size="sm"
              >
                Employers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className={themeColors.text.muted}>No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${themeColors.iconBackgrounds.primary} flex items-center justify-center font-bold`}>
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div>
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(user, 'ban')}
                            disabled={user.status === 'suspended'}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {user.status === 'active' ? 'Suspend' : 'Unsuspend'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(user, 'delete')}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, type: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'ban' ? 'Suspend User' : 'Delete User'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'ban'
                ? `Are you sure you want to suspend ${selectedUser?.firstName} ${selectedUser?.lastName}?`
                : `Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null })}>
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              className={`${actionDialog.type === 'delete' ? themeColors.buttons.danger : themeColors.buttons.warning} text-white`}
            >
              {actionDialog.type === 'ban' ? 'Suspend' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
