import { ILoginRequest, ILoginResponse, Role } from '@/models/auth';
// import { ICreateCustomer, ICustomer } from '@/models/customer';
import { ILicenseResponse } from '@/models/license';
import {
  ICreateMenuCategoryRequest,
  ICreateMenuItem,
  IMenuCategory,
  IMenuCategoryResponse,
  IMenuItem,
  IMenuItemsResponse,
  IUpdateMenuCategoryRequest,
  IUpdateMenuItem,
} from '@/models/menu';
import { IOrderResponse } from '@/models/order';
import {
  ICreateShopRequest,
  IShopResponse,
  IUserShopResponse,
  ShopType,
} from '@/models/shop';
import { ISalesResponse } from '@/models/dashboard';

import axios from 'axios';
import { IBillResponse } from '@/models/billing';

import {
  IChangeUserRoles,
  ICreateUser,
  IShopUserResponse,
} from '@/models/user';

const serverUrl = import.meta.env.VITE_SERVER_URL;

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.Authorization =
      'bearer ' + localStorage.getItem('accessToken');
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  async (error) => {
    // Do something with response error
    if (error.response && error.response.status === 401) {
      // Access token has expired, refresh it
      if (error.config.url.includes('/auth/refreshToken')) {
        window.location.href = '/sign-in';
        return;
      }
      try {
        const newAccessToken = await refreshAccessToken();
        // Update the request headers with the new access token
        error.config.headers['Authorization'] =
          `Bearer ${newAccessToken.data.accessToken}`;
        localStorage.setItem('accessToken', newAccessToken.data.accessToken);
        // Retry the original request
        return axios(error.config);
      } catch (refreshError) {
        // Handle token refresh error
        throw refreshError;
      }
    }
    return Promise.reject(error);
  },
);

const refreshAccessToken = () =>
  axios.post<ILoginResponse>(`${serverUrl}/auth/refreshToken`, {}, {});

export const login = (apiArgs: ILoginRequest) =>
  axios.post<ILoginResponse>(`${serverUrl}/auth/login`, apiArgs);

export const logout = () => axios.post(`${serverUrl}/auth/logout`, {}, {});

export const userInfo = () => axios.get(`${serverUrl}/user/info`);

export const getActiveLicenses = () =>
  axios.get<{ license: ILicenseResponse; valid: boolean }[]>(
    `${serverUrl}/license`,
  );

export const getAllShops = () =>
  axios.get<IUserShopResponse[]>(`${serverUrl}/shop/all`);

export const fetchShopDetails = (shopId: string) =>
  axios.get<IShopResponse>(`${serverUrl}/shop/${shopId}/details`);

export const getMenuCategories = (apiArgs: {
  shopId: string;
  skip?: number;
  take?: number;
  lastSyncTime?: string;
}) =>
  axios.get<IMenuCategoryResponse>(
    `${serverUrl}/menu/category/${apiArgs.shopId}`,
    {
      params: {
        skip: apiArgs.skip,
        take: apiArgs.take,
      },
    },
  );

export const createCategory = (apiArgs: ICreateMenuCategoryRequest) =>
  axios.post<IMenuCategory>(`${serverUrl}/menu/category`, apiArgs);

export const updateCategory = (apiArgs: IUpdateMenuCategoryRequest) =>
  axios.put<IMenuCategory>(`${serverUrl}/menu/category`, apiArgs);

export const getMenuItems = (apiArgs: {
  shopId: string;
  includes?: 'category' | 'shop';
  skip?: number;
  take?: number;
  lastSyncTime?: string;
}) =>
  axios.get<IMenuItemsResponse>(`${serverUrl}/menu/item/${apiArgs.shopId}`, {
    params: {
      skip: apiArgs.skip,
      take: apiArgs.take,
      includes: apiArgs.includes,
    },
  });

export const createMenuItem = (apiArgs: ICreateMenuItem) =>
  axios.post<IMenuItem>(`${serverUrl}/menu/item`, apiArgs);

export const updateMenuITem = (apiArgs: IUpdateMenuItem) =>
  axios.put<IMenuItem>(`${serverUrl}/menu/item`, apiArgs);

export const getOrderById = (orderId: string) =>
  axios.get<IOrderResponse>(`${serverUrl}/order/${orderId}`);

export const getAllOrder = (apiArgs: {
  shopId: string;
  orderStatusId?: number;
  employeeId?: string;
  isClosed?: boolean;
  skip: number;
  take: number;
}) =>
  axios.get<{ orders: IOrderResponse[]; count: number }>(`${serverUrl}/order`, {
    params: apiArgs,
  });

export const getActiveBill = (orderId: string) =>
  axios.get<IBillResponse>(`${serverUrl}/billing/${orderId}`);

export const createShop = (apiArgs: ICreateShopRequest) =>
  axios.post<IBillResponse>(`${serverUrl}/shop`, apiArgs);

export const getShopTypes = (apiArgs: { skip: number; take: number }) =>
  axios.get<{ shopTypes: ShopType[]; count: number; hasNext: boolean }>(
    `${serverUrl}/shop/type`,
    {
      params: apiArgs,
    },
  );

export const getShopUsers = (apiArgs: {
  shopId: string;
  params: { skip: number; take: number; includes: string };
}) =>
  axios.get<IShopUserResponse>(`${serverUrl}/user/all/${apiArgs.shopId}`, {
    params: apiArgs.params,
  });

export const createUser = (apiArgs: ICreateUser) =>
  axios.post<ICreateUser>(`${serverUrl}/user`, apiArgs);

export const getAllRoles = () =>
  axios.get<{ roles: Role[]; count: number; hasNext: boolean }>(
    `${serverUrl}/role`,
    { params: { skip: 0, take: 100 } },
  );

export const updateUserRoles = (apiArgs: IChangeUserRoles) =>
  axios.put(`${serverUrl}/user/roles`, apiArgs);

export const getSalesData = (shopId: string) =>
  axios.get<ISalesResponse>(`${serverUrl}/dashboard/sales/${shopId}`);

export const getSalesDataByRange = (
  shopId: string,
  range: { startDate: string; endDate: string },
) =>
  axios.post<ISalesResponse>(`${serverUrl}/dashboard/sales/${shopId}`, range);
