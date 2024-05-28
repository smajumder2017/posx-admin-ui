import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IUserInfoResponse, Role } from '@/models/auth';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface IUserDetailsProps {
  data: IUserInfoResponse;
  allRoles: Role[];
  onUpdateRole: (ids: number[]) => void;
}

const eqSet = (xs: Set<number>, ys: Set<number>) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));

const UserDetails: React.FC<IUserDetailsProps> = ({
  data,
  allRoles,
  onUpdateRole,
}) => {
  const [selectedRolesId, setSelectedRolesId] = useState<number[]>([]);

  useEffect(() => {
    if (data.userRoles?.length) {
      setSelectedRolesId(
        data.userRoles?.map((userRole) => userRole.roleId) || [],
      );
    } else {
      setSelectedRolesId([]);
    }
  }, [data]);

  const handleRoleSelect = (roleId: number) => {
    const prevRoles = [...selectedRolesId];
    if (selectedRolesId.includes(roleId)) {
      const index = selectedRolesId.findIndex((id) => id === roleId);
      prevRoles.splice(index, 1);
      setSelectedRolesId(prevRoles);
    } else {
      prevRoles.push(roleId);
      setSelectedRolesId(prevRoles);
    }
  };

  const handleUpdaRoleClick = () => {
    onUpdateRole(selectedRolesId);
  };

  const existingRoleSet = new Set(
    data.userRoles?.map((role) => role.roleId) || [],
  );
  const selectedRoleSet = new Set(selectedRolesId);
  const roleChanged = !eqSet(existingRoleSet, selectedRoleSet);

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="details" className="w-[400px]">
        <CardHeader className="flex flex-row items-start">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="roles">Manage Roles</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-6 pt-0 text-sm">
          <TabsContent value="details" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Personal Details</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{data.firstName + ' ' + data.lastName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Contact Number</span>
                  <span>{formatPhoneNumberIntl(data.contactNo)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{data.email || '-'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Account Details</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between mt-2">
                  <span className="text-muted-foreground">User Name</span>
                  <span>{data.userName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account Status</span>
                  <span>
                    {data.isActive ? (
                      <Badge variant={'outline'}>Active</Badge>
                    ) : (
                      <Badge variant="secondary">Deactivated</Badge>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Roles & Permissions</div>
              <div className="flex flex-col gap-1">
                {data?.userRoles?.map((userRole) => {
                  return (
                    <div
                      className="flex items-center justify-between mt-2"
                      key={userRole.id}
                    >
                      <span className="text-muted-foreground">
                        <Badge variant={'outline'}>{userRole.role.value}</Badge>
                      </span>
                      <span>{}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="roles" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {allRoles.map((role) => {
                return (
                  <div
                    key={role.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <Checkbox
                      checked={selectedRolesId?.includes(role.id)}
                      // onCheckedChange={field.onChange}
                      onCheckedChange={() => handleRoleSelect(role.id)}
                    />
                    <Label>{role.value}</Label>
                  </div>
                );
              })}
            </div>
            <Button
              className="w-full"
              disabled={!roleChanged}
              onClick={handleUpdaRoleClick}
            >
              Update Roles
            </Button>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  {/* <ChevronLeft className="h-3.5 w-3.5" /> */}
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  {/* <ChevronRight className="h-3.5 w-3.5" /> */}
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default UserDetails;
