import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { useEffect, useState } from 'react';
import { IShopConfigRequest, IShopConfigResponse } from '@/models/shop';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import * as apis from '@/apis';
import { useParams } from 'react-router-dom';

const chargeSchema = z.object({
  distance: z.number(),
  amount: z.number(),
});

const shopDetailsFormSchema = z.object({
  enabled: z.boolean(),
  serviceRadius: z.number().array(),
  deliveryCharges: z.array(chargeSchema),
});

type ShopDetailsFormValues = z.infer<typeof shopDetailsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ShopDetailsFormValues> = {
  enabled: false,
  serviceRadius: [0],
  deliveryCharges: [{ distance: 0, amount: 0 }],
  // sgstPercentage: '',
  // serviceChargePercentage: '',
};

export function DeliverySettingsForm() {
  const [config, setConfig] = useState<IShopConfigResponse>();
  const { shopId } = useParams<{ shopId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const deliveryForm = useForm<ShopDetailsFormValues>({
    resolver: zodResolver(shopDetailsFormSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    name: 'deliveryCharges',
    control: deliveryForm.control,
  });

  const getShopSettings = async (shopId: string) => {
    try {
      const res = await apis.getShopConfig(shopId);
      deliveryForm.setValue('enabled', res.data.config.delivery.enabled);
      deliveryForm.setValue('serviceRadius', [
        res.data.config.delivery.serviceRadius,
      ]);
      deliveryForm.setValue(
        'deliveryCharges',
        res.data.config.delivery.deliveryCharges,
      );
      setConfig(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateShopConfig = async (payload: IShopConfigRequest) => {
    try {
      await apis.updateShopConfig(payload);
    } catch (error) {
      console.log(error);
    }
  };

  async function onSubmit(data: ShopDetailsFormValues) {
    setIsLoading(true);
    try {
      if (shopId) {
        const payload: IShopConfigRequest = {
          id: config?.id,
          shopId: config?.shopId || shopId,
          config: {
            ...config?.config,
            delivery: {
              ...data,
              serviceRadius: data.serviceRadius[0],
            },
          },
        };

        await updateShopConfig(payload);
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

  useEffect(() => {
    if (shopId) getShopSettings(shopId);
  }, [shopId]);

  const handleAddNewRow: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    append({ distance: 0, amount: 0 });
  };

  return (
    <Form {...deliveryForm}>
      <form onSubmit={deliveryForm.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 py-4">
          <FormField
            control={deliveryForm.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm col-span-1">
                <div className="space-y-0.5">
                  <FormLabel>Delivery</FormLabel>
                  <FormDescription>
                    Enable this switch to enable delivery in your shop
                  </FormDescription>
                </div>
                <Switch
                  name={field.name}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormItem>
            )}
          />
          <FormField
            control={deliveryForm.control}
            name="serviceRadius"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm col-span-1 gap-4">
                <div className="space-y-4 flex-1">
                  <FormLabel>Serviceable Area Radius</FormLabel>
                  <Slider
                    defaultValue={[0]}
                    max={50}
                    step={1}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                  <FormDescription>
                    Your shop can serve {field.value} KMs radius
                  </FormDescription>
                  <FormMessage />
                </div>
                {/* <div>{field.value} KMs</div> */}
              </FormItem>
              // <FormItem className="col-span-1">
              //   <FormLabel>Serviceable Area Radius</FormLabel>
              //   <FormControl>
              //     {/* <Input placeholder="Enter value" {...field} /> */}
              //     <Slider
              //       defaultValue={[0]}
              //       max={50}
              //       step={1}
              //       value={[parseInt(field.value || '0')]}
              //       onValueChange={field.onChange}
              //     />
              //   </FormControl>
              //   <FormDescription>Enter the value in KMs</FormDescription>
              //   <FormMessage />
              // </FormItem>
            )}
          />
          <div className="flex flex-col  rounded-lg border p-2 shadow-sm col-span-1 gap-4">
            {fields.map((_item, index) => {
              return (
                <div className="flex items-center gap-4" key={index}>
                  <FormField
                    control={deliveryForm.control}
                    name={`deliveryCharges.${index}.distance`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Distance Below</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter value"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>Distance cover</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={deliveryForm.control}
                    name={`deliveryCharges.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Charge</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter value"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormDescription>Amount to be charged</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Button
                      disabled={index === 0}
                      onClick={() => remove(index)}
                    >
                      -
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button variant={'secondary'} onClick={handleAddNewRow}>
              Add
            </Button>
          </div>

          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Update details
          </Button>
        </div>
      </form>
    </Form>
  );
}
