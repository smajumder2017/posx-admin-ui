import { useEffect, useState } from 'react';
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react';

import { Separator } from '@/components/ui/separator';

import { Button } from '@/components/custom/button';
import { apps } from './data';
import * as apis from '@/apis';
import { ICreateShopRequest, IUserShopResponse, ShopType } from '@/models/shop';
import { IoRestaurantOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isMobilePhone } from 'validator';

const appText = new Map<string, string>([
  ['all', 'All Shops'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
]);

const shopSchema = z.object({
  shopName: z.string().min(2).max(25),
  shopTypeId: z.string(),
  registrationNo: z.string(),
  contactNo: z.string().refine((value) => isMobilePhone(value), {
    message: 'Enter a valid contact number',
  }),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string().max(6).min(6),
  latitude: z.string(),
  longitude: z.string(),
  gstinNo: z.string().optional(),
  cgstPercentage: z.string().optional(),
  sgstPercentage: z.string().optional(),
  serviceChargePercentage: z.string().optional(),
});

export default function Apps() {
  const [sort, setSort] = useState('ascending');
  const [appType, setAppType] = useState('all');
  const [shops, setShops] = useState<IUserShopResponse[]>([]);
  const [shopTypes, setShopTypes] = useState<ShopType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [createShopDialog, setCreateShopDialog] = useState(false);
  const shopForm = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      shopName: '',
      shopTypeId: '',
      registrationNo: '',
      contactNo: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      latitude: '',
      longitude: '',
      gstinNo: '',
      cgstPercentage: '',
      sgstPercentage: '',
      serviceChargePercentage: '',
    },
  });

  const getAllShops = async () => {
    try {
      const shopsResponse = await apis.getAllShops();
      setShops(shopsResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getShopTYpes = async () => {
    try {
      const shopTypeRes = await apis.getShopTypes({ skip: 0, take: 100 });
      setShopTypes(shopTypeRes.data.shopTypes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllShops();
    getShopTYpes();
  }, []);

  const handleShopCreate = async (payload: ICreateShopRequest) => {
    try {
      await apis.createShop(payload);
      shopForm.reset();
      setCreateShopDialog(false);
      getAllShops();
    } catch (error) {
      console.log(error);
    }
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

  function onShopFormSubmit(values: z.infer<typeof shopSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    // if (selectedMenuItem) {
    //   handleCategoryUpdate({
    //     ...values,
    //     id: selectedMenuItem,
    //     shopId,
    //     price: parseInt(values.price),
    //   });
    //   return;
    // }
    handleShopCreate({
      ...values,
      isActive: true,
      shopTypeId: parseInt(values.shopTypeId),
      cgstPercentage: parseFloat(values.cgstPercentage || '0'),
      sgstPercentage: parseFloat(values.sgstPercentage || '0'),
      serviceChargePercentage: parseFloat(
        values.serviceChargePercentage || '0',
      ),
    });
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

  const handleItemDialogClose = (value: boolean) => {
    setCreateShopDialog(value);
    shopForm.reset();
  };

  const filteredApps = apps
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    )
    .filter((app) =>
      appType === 'connected'
        ? app.connected
        : appType === 'notConnected'
          ? !app.connected
          : true,
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleManageClick = (shopId: string, shopType: string) => {
    navigate(`/shop/${shopId}/${shopType.toLowerCase()}`);
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Shops</h1>
        <p className="text-muted-foreground">
          Here&apos;s a list of your shops to manage!
        </p>
      </div>
      <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
        <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
          <Input
            placeholder="Filter apps..."
            className="h-9 w-40 lg:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={appType} onValueChange={setAppType}>
            <SelectTrigger className="w-36">
              <SelectValue>{appText.get(appType)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="notConnected">Not Connected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-16">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ascending">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="descending">
                <div className="flex items-center gap-4">
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateShopDialog(true)}>New Shop</Button>
      </div>
      <Separator className="shadow" />
      <ul className="no-scrollbar grid gap-4 overflow-y-scroll pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((userShop) => (
          <li
            key={userShop.shop.id}
            className="rounded-lg border p-4 hover:shadow-md"
          >
            <div className="mb-8 flex items-center justify-between">
              <div
                className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
              >
                <IoRestaurantOutline />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleManageClick(
                    userShop.shopId,
                    userShop.shop.shopType.value,
                  )
                }
                // className={`${app.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
              >
                Manage
              </Button>
            </div>
            <div>
              <div className="flex gap-2">
                <h2 className="mb-1 font-semibold">{userShop.shop.shopName}</h2>
                <span className="text-gray-500">{userShop.shop.shopCode}</span>
              </div>

              <p className="line-clamp-2 text-gray-500">
                {`${userShop.shop.state}, ${userShop.shop.city} - ${userShop.shop.pincode}`}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Dialog open={createShopDialog} onOpenChange={handleItemDialogClose}>
        <DialogContent className="sm:max-w-[600px]">
          <Form {...shopForm}>
            <form onSubmit={shopForm.handleSubmit(onShopFormSubmit)}>
              <DialogHeader>
                <DialogTitle>Create New Shop</DialogTitle>
                <DialogDescription>
                  Fill up the details. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={shopForm.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter shop name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be public shop display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shopForm.control}
                  name="shopTypeId"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Shop Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a shop type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Shop Types</SelectLabel>
                              {shopTypes.map((type) => {
                                return (
                                  <SelectItem
                                    value={type.id.toString()}
                                    key={type.id}
                                  >
                                    {type.value}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Select shop type, this will help you to manage the
                        things better
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shopForm.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shopForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter shop address" {...field} />
                      </FormControl>
                      <FormDescription>
                        Shop address will be printed on your bills
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={shopForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>States</SelectLabel>
                                <SelectItem value={'West Bengal'}>
                                  West Bengal
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select your shop state
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shopForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose City" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Cities</SelectLabel>
                                <SelectItem value={'Kolkata'}>
                                  Kolkata
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>Select your shop city</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={shopForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pincode" {...field} />
                      </FormControl>
                      <FormDescription>Enter your shop pincode</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={shopForm.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter latitude" {...field} />
                        </FormControl>
                        <FormDescription>
                          Help us to locate your shop
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shopForm.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter longitude" {...field} />
                        </FormControl>
                        <FormDescription>
                          Help us to locate your shop
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={shopForm.control}
                  name="gstinNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter gstin number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is required to calculate gst
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={shopForm.control}
                    name="cgstPercentage"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>CGST Percentage</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter value" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is required to calculate gst
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shopForm.control}
                    name="sgstPercentage"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>SGST Percentage</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter value" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is required to calculate gst
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={shopForm.control}
                  name="serviceChargePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Charge Percentage</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter value" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is required to calculate service charges
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
