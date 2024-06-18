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
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { IUpdateShopRequest } from '@/models/shop';
import { updateShopDetails } from '@/redux/features/shopSlice';

const shopDetailsFormSchema = z.object({
  gstinNo: z.string().optional(),
  cgstPercentage: z.string().optional(),
  sgstPercentage: z.string().optional(),
  serviceChargePercentage: z.string().optional(),
});

type ShopDetailsFormValues = z.infer<typeof shopDetailsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ShopDetailsFormValues> = {
  gstinNo: '',
  cgstPercentage: '',
  sgstPercentage: '',
  serviceChargePercentage: '',
};

export function GstAndChargesForm() {
  const dispatch = useAppDispatch();
  const { data: shopDetails } = useAppSelector((state) => state.shop);
  const [isLoading, setIsLoading] = useState(false);
  const shopForm = useForm<ShopDetailsFormValues>({
    resolver: zodResolver(shopDetailsFormSchema),
    defaultValues: shopDetails
      ? {
          ...defaultValues,
          gstinNo: shopDetails.gstinNo || '',
          cgstPercentage: shopDetails.cgstPercentage?.toString() || '',
          sgstPercentage: shopDetails.sgstPercentage?.toString() || '',
          serviceChargePercentage:
            shopDetails.serviceChargePercentage?.toString() || '',
        }
      : defaultValues,
  });

  const updateShop = useCallback(async (payload: IUpdateShopRequest) => {
    return dispatch(updateShopDetails(payload)).unwrap();
  }, []);

  async function onSubmit({
    cgstPercentage,
    sgstPercentage,
    serviceChargePercentage,
    ...data
  }: ShopDetailsFormValues) {
    setIsLoading(true);
    try {
      if (shopDetails) {
        const payload: IUpdateShopRequest = {
          ...data,
          id: shopDetails.id,
          shopTypeId: shopDetails.shopTypeId,
          isActive: shopDetails.isActive,
        };
        if (cgstPercentage) payload.cgstPercentage = parseFloat(cgstPercentage);

        if (sgstPercentage) payload.sgstPercentage = parseFloat(sgstPercentage);

        if (serviceChargePercentage)
          payload.serviceChargePercentage = parseFloat(serviceChargePercentage);

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

          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Update details
          </Button>
        </div>
      </form>
    </Form>
  );
}
