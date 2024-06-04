import { Button } from '@/components/custom/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCallback, useEffect, useState } from 'react';
import CategoryList from './components/category-list';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

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
import {
  ICreateMenuCategoryRequest,
  IMenuCategory,
  IUpdateMenuCategoryRequest,
} from '@/models/menu';
import * as apis from '@/apis';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from '@/utils/processApiError';
import { Loader } from '@/components/custom/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const categorySchema = z.object({
  categoryName: z.string().min(2).max(50),
  isActive: z.boolean(),
});

const MenuCategory = () => {
  const [tab, setTab] = useState('categories');
  const { shopId } = useParams<{ shopId: string }>();
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [loader, setLoader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      isActive: false,
    },
  });
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const fetchMenuCategories = useCallback(async (shopId: string) => {
    try {
      setLoader(true);
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

  useEffect(() => {
    if (shopId) fetchMenuCategories(shopId);
  }, [shopId]);

  const handleTabChange = (value: string) => {
    setTab(value);
  };

  const handleCategoryDialogClose = (value: boolean) => {
    setCategoryDialog(value);
    categoryForm.reset();
  };

  const handleCategoryCreate = async (payload: ICreateMenuCategoryRequest) => {
    setSaving(true);
    try {
      await apis.createCategory(payload);
      categoryForm.reset();
      setCategoryDialog(false);
      fetchMenuCategories(payload.shopId);
    } catch (error) {
      setError({ title: 'Failed to create', message: getErrorMessage(error) });
    }
    setSaving(false);
  };

  const handleCategoryUpdate = async (payload: IUpdateMenuCategoryRequest) => {
    try {
      await apis.updateCategory(payload);
      categoryForm.reset();
      setSelectedCategoryId('');
      setCategoryDialog(false);
      fetchMenuCategories(payload.shopId);
    } catch (error) {
      setError({ title: 'Failed to update', message: getErrorMessage(error) });
    }
  };

  function onCategoryFormSubmit(values: z.infer<typeof categorySchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (shopId) {
      if (selectedCategoryId) {
        handleCategoryUpdate({ ...values, id: selectedCategoryId, shopId });
        return;
      }
      handleCategoryCreate({ ...values, shopId });
    }
  }

  const handleEditClick = (categoryId: string) => {
    const category = categories.find((category) => category.id === categoryId);
    if (category) {
      categoryForm.setValue('categoryName', category.categoryName);
      categoryForm.setValue('isActive', category.isActive);
      setSelectedCategoryId(categoryId);
      setCategoryDialog(true);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Menu Categories & Cuisines
        </h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setCategoryDialog(true)}>New Category</Button>
        </div>
      </div>
      <Tabs
        orientation="vertical"
        value={tab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <div className="w-full pb-2">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            {/* <TabsTrigger value="cuisines">Cuisines</TabsTrigger> */}
          </TabsList>
        </div>
        <TabsContent value="categories">
          <Card className="col-span-1">
            <CardHeader className="px-7">
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>
                View and manage your your menu categories
              </CardDescription>
            </CardHeader>
            {loader && <Loader />}
            <CardContent>
              {categories.length ? (
                <CategoryList data={categories} onEditClick={handleEditClick} />
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={categoryDialog} onOpenChange={handleCategoryDialogClose}>
        {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onCategoryFormSubmit)}>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
                <DialogDescription>
                  Fill up the details. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={categoryForm.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={categoryForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-y-0 gap-2">
                      <FormControl>
                        <Switch
                          id="isActive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Activated</FormLabel>
                      <FormDescription>
                        This is your public display name.
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
    </>
  );
};

export default MenuCategory;
