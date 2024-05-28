import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { prettyDateTime } from '@/utils/date';

import { IUserInfoResponse } from '../../../../../models/auth';
import { Button } from '@/components/custom/button';
import { MdModeEditOutline } from 'react-icons/md';

interface IUserListProps {
  users: IUserInfoResponse[];
  onUserSelect?: (orderId: string) => void;
  selectedUser?: string;
}

const UserList: React.FC<IUserListProps> = ({
  users,
  onUserSelect,
  selectedUser,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User Name</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead className="hidden sm:table-cell">Contact No</TableHead>
          <TableHead className="hidden sm:table-cell">First Name</TableHead>
          <TableHead className="hidden md:table-cell">Last Name</TableHead>
          <TableHead className="hidden md:table-cell">Roles</TableHead>
          <TableHead className="hidden md:table-cell">Created On</TableHead>
          <TableHead className="hidden md:table-cell">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => {
          return (
            <TableRow
              key={user.id}
              className={`text-xs 2xl:text-sm ${
                selectedUser === user.id ? 'bg-accent' : ''
              }`}
            >
              <TableCell className="font-medium">
                <div
                  className="hover:cursor-pointer"
                  onClick={() => onUserSelect?.(user.id)}
                >
                  {user.userName}
                </div>

                {/* <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div> */}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.email || '-'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="font-medium">{user.contactNo}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.firstName}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.lastName}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex gap-1">
                  {user.userRoles?.map((userRoles) => {
                    return (
                      <Badge key={userRoles.id} variant={'outline'}>
                        {userRoles.role.value}
                      </Badge>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {prettyDateTime(new Date(user.createdAt))}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Button
                  variant={'outline'}
                  size={'icon'}
                  disabled={user.userRoles?.some(
                    (userRole) => userRole.role.value === 'OWNER',
                  )}
                  // onClick={() => {
                  //   onEditClick?.(item.id);
                  // }}
                >
                  <MdModeEditOutline />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default UserList;
