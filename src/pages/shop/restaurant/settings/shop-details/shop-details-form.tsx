import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { isMobilePhone } from 'validator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PhoneInput } from '@/components/ui/phone-input';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { IUpdateShopRequest } from '@/models/shop';
import { updateShopDetails } from '@/redux/features/shopSlice';

const shopDetailsFormSchema = z.object({
  shopName: z.string().min(2).max(25),
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
  // gstinNo: z.string().optional(),
  // cgstPercentage: z.string().optional(),
  // sgstPercentage: z.string().optional(),
  // serviceChargePercentage: z.string().optional(),
});

type ShopDetailsFormValues = z.infer<typeof shopDetailsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ShopDetailsFormValues> = {
  shopName: '',
  registrationNo: '',
  contactNo: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  latitude: '',
  longitude: '',
  // gstinNo: '',
  // cgstPercentage: '',
  // sgstPercentage: '',
  // serviceChargePercentage: '',
};

export function ShopDetailsForm() {
  const dispatch = useAppDispatch();
  const { data: shopDetails } = useAppSelector((state) => state.shop);
  const [isLoading, setIsLoading] = useState(false);
  const shopForm = useForm<ShopDetailsFormValues>({
    resolver: zodResolver(shopDetailsFormSchema),
    defaultValues: shopDetails
      ? {
          ...defaultValues,
          shopName: shopDetails.shopName,
          // contactNo: parsePhoneNumber(shopDetails.contactNo, {
          //   defaultCountry: 'IN',
          //   extract: true,
          // })?.nationalNumber,
          contactNo: shopDetails.contactNo,
          address: shopDetails.address,
          state: shopDetails.state,
          city: shopDetails.city,
          pincode: shopDetails.pincode,
          latitude: shopDetails.latitude,
          longitude: shopDetails.longitude,
          // gstinNo: shopDetails.gstinNo || '',
          // cgstPercentage: shopDetails.cgstPercentage?.toString() || '',
          // sgstPercentage: shopDetails.sgstPercentage?.toString() || '',
          // serviceChargePercentage:
          //   shopDetails.serviceChargePercentage?.toString() || '',
        }
      : defaultValues,
  });

  const updateShop = useCallback(async (payload: IUpdateShopRequest) => {
    return dispatch(updateShopDetails(payload)).unwrap();
  }, []);

  async function onSubmit(data: ShopDetailsFormValues) {
    setIsLoading(true);
    try {
      if (shopDetails) {
        const payload: IUpdateShopRequest = {
          ...data,
          id: shopDetails.id,
          shopTypeId: shopDetails.shopTypeId,
          isActive: shopDetails.isActive,
        };

        await updateShop(payload);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  useEffect(() => {}, []);

  return (
    <Form {...shopForm}>
      <form onSubmit={shopForm.handleSubmit(onSubmit)}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormDescription>Select your shop state</FormDescription>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cities</SelectLabel>
                          <SelectItem value={'Kolkata'}>Kolkata</SelectItem>
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
                  <FormDescription>Help us to locate your shop</FormDescription>
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
                  <FormDescription>Help us to locate your shop</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Update details
          </Button>
        </div>
      </form>
    </Form>
  );
}
