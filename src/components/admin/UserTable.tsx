
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

// Mock users for the admin panel
const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: UserRole.ADMIN, lastLogin: "2023-05-15T10:30:00Z" },
  { id: "2", name: "Friend User", email: "friend@example.com", role: UserRole.FRIEND, lastLogin: "2023-05-14T14:45:00Z" },
  { id: "3", name: "Normal User", email: "user@example.com", role: UserRole.NORMAL, lastLogin: "2023-05-13T09:15:00Z" },
  { id: "4", name: "Opponent User", email: "opponent@example.com", role: UserRole.OPPONENT, lastLogin: "2023-05-12T16:20:00Z" },
  { id: "5", name: "Sarah Johnson", email: "sarah@example.com", role: UserRole.NORMAL, lastLogin: "2023-05-11T11:10:00Z" },
  { id: "6", name: "Michael Brown", email: "michael@example.com", role: UserRole.NORMAL, lastLogin: "2023-05-10T13:25:00Z" },
  { id: "7", name: "Emma Wilson", email: "emma@example.com", role: UserRole.FRIEND, lastLogin: "2023-05-09T10:05:00Z" },
  { id: "8", name: "James Davis", email: "james@example.com", role: UserRole.OPPONENT, lastLogin: "2023-05-08T15:40:00Z" }
];

const UserTable: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof mockUsers[0] | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.NORMAL);

  const handleEdit = (user: typeof mockUsers[0]) => {
    setCurrentUser(user);
    setSelectedRole(user.role);
    setIsEditing(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = () => {
    if (currentUser) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? { ...user, role: selectedRole } : user
      ));
      setIsEditing(false);
      setCurrentUser(null);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-500 hover:bg-purple-600";
      case UserRole.FRIEND:
        return "bg-green-500 hover:bg-green-600";
      case UserRole.OPPONENT:
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                    {user.role.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.lastLogin)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                    Change Role
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {currentUser && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">User</p>
                  <p className="text-sm">{currentUser.name} ({currentUser.email})</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={(value: UserRole) => handleRoleChange(value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.FRIEND}>Friend/Partner (20% Discount)</SelectItem>
                      <SelectItem value={UserRole.NORMAL}>Normal User</SelectItem>
                      <SelectItem value={UserRole.OPPONENT}>Opponent/Rival (20% Markup)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserTable;
