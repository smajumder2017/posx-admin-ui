export interface IMenuCategoryResponse {
  menuCategories: IMenuCategory[];
  count: number;
  hasNext: boolean;
}
export interface IMenuCategory {
  id: string;
  categoryName: string;
  isActive: boolean;
  displayIndex: number;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  menuItems?: IMenuItem[];
}
export interface IMenuItem {
  id: string;
  itemName: string;
  shortCode: string;
  description: string;
  availability: boolean;
  isActive: boolean;
  foodType: string;
  price: number;
  onlineDeliveryPrice: number;
  waitingTime: number;
  spiceScale: string;
  servingTime: string;
  itemImageUrl: string;
  categoryId: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  category?: IMenuCategory;
}

export interface IMenuItemsResponse {
  menuItems: IMenuItem[];
  count: number;
  hasNext: boolean;
}

export interface ICreateMenuCategoryRequest {
  categoryName: string;
  shopId: string;
  isActive: boolean;
}

export interface IUpdateMenuCategoryRequest
  extends Partial<ICreateMenuCategoryRequest> {
  id: string;
  isDeleted?: boolean;
  displayIndex?: number;
  shopId: string;
}

export interface ICreateMenuItem {
  itemName: string;
  description: string;
  availability: boolean;
  isActive?: boolean;
  categoryId: string;
  foodType: string;
  price: number;
  onlineDeliveryPrice?: number;
  waitingTime?: number;
  spiceScale: string;
  servingTime?: string;
  itemImageUrl?: string;
  remoteImageId?: string;
  shopId: string;
}

export interface IUpdateMenuItem extends Partial<ICreateMenuItem> {
  id: string;
  shopId: string;
}
