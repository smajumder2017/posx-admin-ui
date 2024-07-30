import {
  ICreateMenuItem,
  IMenuCategory,
  IMenuItem,
  IUpdateMenuItem,
} from '@/models/menu';
import { useCallback, useEffect, useState } from 'react';
import * as apis from '@/apis';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import MenuItemList from './components/menu-item-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { Food_Type, Spice_Scale } from '@/utils/enums';
import { Loader } from '@/components/custom/loader';
import { getErrorMessage } from '@/utils/processApiError';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const menuItemSchema = z.object({
  itemName: z.string().min(2).max(50),
  description: z.string(),
  availability: z.boolean(),
  categoryId: z.string(),
  foodType: z.string(),
  spiceScale: z.string(),
  price: z.string(),
  onlineDeliveryPrice: z.string(),
});

const Menutems = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [menuItemDialog, setMenuItemDialog] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [loader, setLoader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );

  const menuItemForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      itemName: '',
      description: '',
      categoryId: '',
      foodType: '',
      spiceScale: '',
      price: '',
      onlineDeliveryPrice: '',
      availability: false,
    },
  });

  const fetchMenuItems = useCallback(async (shopId: string) => {
    setLoader(true);
    try {
      const menuItemRes = await apis.getMenuItems({
        shopId,
        includes: 'category',
        skip: 0,
        take: 100,
      });
      setMenuItems(
        menuItemRes.data.menuItems.sort(
          (a, b) =>
            (a.category?.displayIndex || 1) - (b.category?.displayIndex || 1),
        ),
      );
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  }, []);
  const fetchMenuCategories = useCallback(async (shopId: string) => {
    setLoader(true);
    try {
      const categoryRes = await apis.getMenuCategories({
        shopId,
        skip: 0,
        take: 100,
      });
      setCategories(categoryRes.data.menuCategories);
    } catch (error) {
      console.log(error);
    }
    setLoader(false);
  }, []);

  const handleItemCreate = async (payload: ICreateMenuItem) => {
    setError(null);
    setSaving(true);
    try {
      await apis.createMenuItem(payload);
      menuItemForm.reset();
      setMenuItemDialog(false);
      fetchMenuItems(payload.shopId);
    } catch (error) {
      setError({ title: 'Failed to create', message: getErrorMessage(error) });
    }
    setSaving(false);
  };

  const handleCategoryUpdate = async (payload: IUpdateMenuItem) => {
    setError(null);
    setSaving(true);
    try {
      await apis.updateMenuITem(payload);
      menuItemForm.reset();
      setSelectedMenuItem('');
      setMenuItemDialog(false);
      fetchMenuItems(payload.shopId);
    } catch (error) {
      setError({ title: 'Failed to update', message: getErrorMessage(error) });
    }
    setSaving(false);
  };

  function onCategoryFormSubmit(values: z.infer<typeof menuItemSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (shopId) {
      if (selectedMenuItem) {
        handleCategoryUpdate({
          ...values,
          id: selectedMenuItem,
          shopId,
          price: parseInt(values.price),
          onlineDeliveryPrice: parseInt(values.onlineDeliveryPrice),
        });
        return;
      }
      handleItemCreate({
        ...values,
        price: parseInt(values.price),
        onlineDeliveryPrice: parseInt(values.onlineDeliveryPrice),
        shopId,
      });
    }
  }

  const handleEditClick = (itemId: string) => {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (menuItem) {
      menuItemForm.setValue('itemName', menuItem.itemName);
      menuItemForm.setValue('description', menuItem.description);
      menuItemForm.setValue('categoryId', menuItem.categoryId);
      menuItemForm.setValue('foodType', menuItem.foodType);
      menuItemForm.setValue('spiceScale', menuItem.spiceScale);
      menuItemForm.setValue('price', menuItem.price.toString());
      menuItemForm.setValue(
        'onlineDeliveryPrice',
        menuItem.onlineDeliveryPrice?.toString(),
      );
      menuItemForm.setValue('availability', menuItem.availability);

      setSelectedMenuItem(itemId);
      setMenuItemDialog(true);
    }
  };

  const handleItemDialogClose = (value: boolean) => {
    setMenuItemDialog(value);
    menuItemForm.reset();
    setSelectedMenuItem('');
  };

  useEffect(() => {
    if (shopId) {
      fetchMenuItems(shopId);
      fetchMenuCategories(shopId);
    }
  }, [shopId, fetchMenuItems]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Menu Items
        </h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setMenuItemDialog(true)}>New Item</Button>
        </div>
      </div>
      <Card className="col-span-1">
        <CardHeader className="px-7">
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>
            View and manage your your menu categories
          </CardDescription>
        </CardHeader>
        {loader && <Loader />}
        <CardContent>
          {menuItems.length ? (
            <MenuItemList data={menuItems} onEditClick={handleEditClick} />
          ) : null}
        </CardContent>
      </Card>
      <Dialog open={menuItemDialog} onOpenChange={handleItemDialogClose}>
        <DialogContent className="sm:max-w-[600px]">
          <Form {...menuItemForm}>
            <form onSubmit={menuItemForm.handleSubmit(onCategoryFormSubmit)}>
              <DialogHeader>
                <DialogTitle>Create Item</DialogTitle>
                <DialogDescription>
                  Fill up the details. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={menuItemForm.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be public item display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter item description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add some description about this dish.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={menuItemForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Item Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Menu Categories</SelectLabel>
                                {categories
                                  .filter((category) => category.isActive)
                                  .map((category) => {
                                    return (
                                      <SelectItem
                                        value={category.id}
                                        key={category.id}
                                      >
                                        {category.categoryName}
                                      </SelectItem>
                                    );
                                  })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Adding a category will help user to search for a dish.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={menuItemForm.control}
                    name="foodType"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Food Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose food type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Food Types</SelectLabel>
                                <SelectItem value={Food_Type.Vegetarian}>
                                  {Food_Type.Vegetarian}
                                </SelectItem>
                                <SelectItem value={Food_Type.NonVegetarian}>
                                  {Food_Type.NonVegetarian}
                                </SelectItem>
                                <SelectItem value={Food_Type.VEGAN}>
                                  {Food_Type.VEGAN}
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Add some description about this dish.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={menuItemForm.control}
                  name="spiceScale"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Spice Scale</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose spice scale" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Spice Scales</SelectLabel>
                              <SelectItem value={Spice_Scale.None}>
                                {Spice_Scale.None}
                              </SelectItem>
                              <SelectItem value={Spice_Scale.Mild}>
                                {Spice_Scale.Mild}
                              </SelectItem>{' '}
                              <SelectItem value={Spice_Scale.Moderate}>
                                {Spice_Scale.Moderate}
                              </SelectItem>{' '}
                              <SelectItem value={Spice_Scale.Spicy}>
                                {Spice_Scale.Spicy}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Add some description about this dish.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item price" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be selling price of your dish.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="onlineDeliveryPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Online Delivery Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter item price (Online Delivery)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be online delivery price of your dish.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={menuItemForm.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 gap-2">
                      <FormControl>
                        <Switch
                          id="availibility"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        Check this to mark your item available to serve
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
    </div>
  );
};

export default Menutems;
