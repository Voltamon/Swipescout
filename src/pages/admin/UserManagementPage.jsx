import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
} from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Input } from '@/components/UI/input.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu.jsx';
import { getUsers, deleteUser, banUser, updateUserRole } from '@/services/api';
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
  // const { t } = useTranslation(); // Removed: unused variable
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
      // On error, clear list and let UI show empty state. Do not fall back to mock data.
      setUsers([]);
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
        case 'make_admin':
          await updateUserRole(selectedUser.id, { role: 'admin' });
          break;
        case 'revoke_admin':
          // Default demotion to job_seeker. Adjust if you need to restore a previous role.
          await updateUserRole(selectedUser.id, { role: 'job_seeker' });
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

  // Dialog labels & classes for different actions
  const actionButtonLabel = actionDialog.type === 'ban'
    ? 'Suspend'
    : actionDialog.type === 'delete'
    ? 'Delete'
    : actionDialog.type === 'make_admin'
    ? 'Make Admin'
    : actionDialog.type === 'revoke_admin'
    ? 'Revoke Admin'
    : 'Confirm';

  const actionButtonClass = actionDialog.type === 'delete'
    ? themeColors.buttons.danger
    : actionDialog.type === 'ban'
    ? themeColors.buttons.warning
    : actionDialog.type === 'make_admin'
    ? themeColors.buttons.primary
    : themeColors.buttons.warning;

  const getRoleBadge = (role) => {
    // Normalize role which may be stored as a string, an array, or null
    let label = i18n.t('auto_no_role');
    if (Array.isArray(role)) {
      label = role.join(', ');
    } else if (role) {
      label = role;
    }

    // Replace underscores with spaces for display
    label = String(label).replace(/_/g, ' ');

    return (
      <Badge variant="outline">
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>{i18n.t('auto_user_management')}</h2>
        <p className={themeColors.text.secondary}>{i18n.t('auto_manage_all_platform_users_and_their_acce')}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={i18n.t('auto_search_users')} 
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
              >{i18n.t('auto_all')}</Button>
              <Button
                variant={roleFilter === 'job_seeker' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('job_seeker')}
                size="sm"
              >{i18n.t('auto_job_seekers')}</Button>
              <Button
                variant={roleFilter === 'employer' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('employer')}
                size="sm"
              >{i18n.t('auto_employers')}</Button>
              <Button
                variant={roleFilter === 'admin' ? 'default' : 'outline'}
                onClick={() => setRoleFilter('admin')}
                size="sm"
              >{i18n.t('auto_admins')}</Button>
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
                <TableHead>{i18n.t('auto_user')}</TableHead>
                <TableHead>{i18n.t('auto_email')}</TableHead>
                <TableHead>{i18n.t('auto_role')}</TableHead>
                <TableHead>{i18n.t('auto_status')}</TableHead>
                <TableHead>{i18n.t('auto_joined')}</TableHead>
                <TableHead className="text-right">{i18n.t('auto_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>{i18n.t('auto_loading_users')}</div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className={themeColors.text.muted}>{i18n.t('auto_no_users_found')}</p>
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
                            <Eye className="mr-2 h-4 w-4" />{i18n.t('auto_view_profile')}</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(user, 'ban')}
                            disabled={user.status === 'suspended'}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {user.status === 'active' ? 'Suspend' : 'Unsuspend'}
                          </DropdownMenuItem>
                          {/* Make / Revoke Admin */}
                          <DropdownMenuItem
                            onClick={() => handleAction(user, Array.isArray(user.role) ? (user.role.includes('admin') ? 'revoke_admin' : 'make_admin') : (user.role === 'admin' ? 'revoke_admin' : 'make_admin'))}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            {Array.isArray(user.role) ? (user.role.includes('admin') ? 'Revoke Admin' : 'Make Admin') : (user.role === 'admin' ? 'Revoke Admin' : 'Make Admin')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction(user, 'delete')}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />{i18n.t('auto_delete')}</DropdownMenuItem>
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
              {actionDialog.type === 'ban' ? 'Suspend User' : actionDialog.type === 'delete' ? 'Delete User' : actionDialog.type === 'make_admin' ? 'Make Admin' : actionDialog.type === 'revoke_admin' ? 'Revoke Admin' : ''}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'ban' && `Are you sure you want to suspend ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
              {actionDialog.type === 'delete' && `Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
              {actionDialog.type === 'make_admin' && `Are you sure you want to make ${selectedUser?.firstName} ${selectedUser?.lastName} an admin?`}
              {actionDialog.type === 'revoke_admin' && `Are you sure you want to revoke admin privileges from ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null })}>{i18n.t('auto_cancel')}</Button>
            <Button
              onClick={executeAction}
              className={`${actionButtonClass} text-white`}
            >
              {actionButtonLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
