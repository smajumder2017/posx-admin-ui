import { useParams, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import * as apis from '@/apis';
import { useAppSelector } from '@/hooks/redux';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Paginate } from '@/components/custom/paginate';
import { IUserInfoResponse, Role } from '@/models/auth';
import UserList from './components/user-list';
import { Button } from '@/components/custom/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { ICreateUser } from '@/models/user';
import UserDetails from './components/user-details';
import { Loader } from '@/components/custom/loader';
import { getErrorMessage } from '@/utils/processApiError';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const userSchema = z
  .object({
    userName: z.string().min(2).max(10),
    email: z.string().email().optional().or(z.literal('')),
    contactNo: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

export default function Users() {
  const { shopId } = useParams<{
    shopId: string;
  }>();

  const [users, setUsers] = useState<IUserInfoResponse[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const authState = useAppSelector((state) => state.auth);
  const [totalCount, setTotalCount] = useState(0);
  const [userDialog, setUserDialog] = useState(false);
  const [loader, setLoader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userName: '',
      email: '',
      contactNo: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0');
  const itemsPerPage = 20;

  const fetchShopUsers = useCallback(
    async (args: {
      shopId: string;

      skip?: number;
      take?: number;
    }) => {
      setLoader(true);
      try {
        const userRes = await apis.getShopUsers({
          shopId: args.shopId,
          params: {
            skip: args.skip || 0,
            take: args.take || itemsPerPage,
            includes: 'userRoles',
          },
        });
        console.log(userRes.data);
        setTotalCount(userRes.data.count);
        setUsers(userRes.data.users);
      } catch (error) {
        console.log(error);
      }
      setLoader(false);
    },
    [],
  );

  const fetchAllRoles = useCallback(async () => {
    setLoader(true);
    try {
      const roleRes = await apis.getAllRoles();
      setAllRoles(roleRes.data.roles);
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  }, []);

  useEffect(() => {
    if (shopId) {
      const skip = itemsPerPage * page;
      fetchShopUsers({
        shopId,
        skip,
        take: itemsPerPage,
      });
      fetchAllRoles();
    }
  }, [shopId, fetchShopUsers, authState.data, page]);

  const handlePageChange = (page: number) => {
    console.log(page);

    setSearchParams({ ...searchParams, page: page.toString() });
  };

  const handleUserCreate = async (payload: ICreateUser) => {
    setSaving(true);
    try {
      await apis.createUser(payload);
      userForm.reset();
      setUserDialog(false);
      const skip = itemsPerPage * page;
      shopId &&
        fetchShopUsers({
          shopId,
          skip,
          take: itemsPerPage,
        });
    } catch (error) {
      console.log(error);
      setError({ title: 'Failed to create', message: getErrorMessage(error) });
    }
    setSaving(false);
  };

  // const handleCategoryUpdate = async (payload: IUpdateMenuItem) => {
  //   try {
  //     await apis.updateMenuITem(payload);
  //     menuItemForm.reset();
  //     setSelectedMenuItem('');
  //     setMenuItemDialog(false);
  //     fetchMenuItems(payload.shopId);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  function onUserFormSubmit(values: z.infer<typeof userSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (shopId) {
      // if (selectedMenuItem) {
      //   handleCategoryUpdate({
      //     ...values,
      //     id: selectedMenuItem,
      //     shopId,
      //     price: parseInt(values.price),
      //   });
      //   return;
      // }
      const payload: ICreateUser = {
        userName: values.userName,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        contactNo: values.contactNo,

        shopId,
        isActive: true,
      };
      if (values.email) {
        payload.email = values.email;
      }
      handleUserCreate(payload);
    }
  }

  // const handleEditClick = (itemId: string) => {
  //   const menuItem = menuItems.find((item) => item.id === itemId);
  //   if (menuItem) {
  //     menuItemForm.setValue('itemName', menuItem.itemName);
  //     menuItemForm.setValue('description', menuItem.description);
  //     menuItemForm.setValue('categoryId', menuItem.categoryId);
  //     menuItemForm.setValue('foodType', menuItem.foodType);
  //     menuItemForm.setValue('spiceScale', menuItem.spiceScale);
  //     menuItemForm.setValue('price', menuItem.price.toString());
  //     menuItemForm.setValue('availability', menuItem.availability);

  //     setSelectedMenuItem(itemId);
  //     setMenuItemDialog(true);
  //   }
  // };

  const handleUserDialogClose = (value: boolean) => {
    setUserDialog(value);
    userForm.reset();
  };

  const userDetails = users.find((user) => user.id === selectedUser);

  const handleuserRoleUpdate = async (roleIds: number[]) => {
    if (userDetails) {
      const selectedUserExistingRoles = userDetails?.userRoles;

      const userRolesToDetele: string[] = [];
      const userRolesToInsert: Array<{ roleId: number; userId: string }> = [];
      roleIds?.forEach((roleId) => {
        const existing = selectedUserExistingRoles?.find(
          (userRole) => userRole.roleId === roleId,
        );
        if (!existing) {
          userRolesToInsert.push({ roleId, userId: userDetails.id });
        }
      });
      selectedUserExistingRoles?.forEach((userRole) => {
        if (!roleIds.includes(userRole.roleId)) {
          userRolesToDetele.push(userRole.id);
        }
      });

      const payload = {
        create: userRolesToInsert,
        delete: userRolesToDetele,
      };
      await apis.updateUserRoles(payload);
      if (shopId) {
        const skip = itemsPerPage * page;
        await fetchShopUsers({
          shopId,
          skip,
          take: itemsPerPage,
        });
        console.log(payload);
      }
    }
  };
  return (
    <>
      {/* ===== Main ===== */}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Shop Users
          </h1>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setUserDialog(true)}>New User</Button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col flex-1 gap-4">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  (Showing {users.length}/{totalCount}) users from your store.
                </CardDescription>
              </CardHeader>
              {loader && <Loader />}
              <CardContent>
                {users.length ? (
                  <UserList
                    users={users}
                    onUserSelect={setSelectedUser}
                    selectedUser={selectedUser}
                  />
                ) : null}
              </CardContent>
            </Card>
            {users.length ? (
              <Paginate
                totalCount={totalCount}
                maxPages={5}
                itemsPerPage={itemsPerPage}
                value={page}
                onChange={handlePageChange}
              />
            ) : null}
          </div>
          {userDetails && (
            <div>
              <UserDetails
                data={userDetails}
                allRoles={allRoles.filter(
                  (role) => !['OWNER', 'ADMIN'].includes(role.value),
                )}
                onUpdateRole={handleuserRoleUpdate}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={userDialog} onOpenChange={handleUserDialogClose}>
        <DialogContent className="sm:max-w-[600px]">
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onUserFormSubmit)}>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Fill up the details. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                        This will be public item display name.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                        Add some description about this dish.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={userForm.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter user name" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                        Add some description about this dish.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            {...field}
                          />
                        </FormControl>
                        {/* <FormDescription>
                        This will be public item display name.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter password again"
                            {...field}
                          />
                        </FormControl>
                        {/* <FormDescription>
                        Add some description about this dish.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userForm.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            // countrySelectProps={{ disabled: false }}
                            // onCountryChange={setCountry}
                            // className="col-span-4"
                            // value={phoneNumber}
                            // onChange={setPhoneNumber}
                            placeholder="Enter a phone number"
                            defaultCountry="IN"
                            // onKeyUp={handleSubmit}
                            // disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        {/* <FormDescription>
                        Add some description about this dish.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={userForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Email Id</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email id " {...field} />
                        </FormControl>
                        {/* <FormDescription>
                        Add some description about this dish.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>{error.title}</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter>
                  <Button type="submit" loading={saving} disabled={saving}>
                    Save changes
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
