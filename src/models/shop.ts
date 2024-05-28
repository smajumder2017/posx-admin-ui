export interface IShopResponse {
  id: string;
  shopName: string;
  shopCode: string;
  shopTypeId: number;
  registrationNo: string;
  isActive: boolean;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  shopType: ShopType;
  gstinNo?: string;
  cgstPercentage?: number;
  sgstPercentage?: number;
  serviceChargePercentage?: number;
}

export interface ICreateShopRequest
  extends Omit<
    IShopResponse,
    'id' | 'shopCode' | 'createdAt' | 'updatedAt' | 'shopType'
  > {}

export interface ShopType {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserShopResponse {
  id: string;
  userId: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  shop: IShopResponse;
}
