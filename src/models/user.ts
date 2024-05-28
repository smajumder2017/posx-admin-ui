import { IUserInfoResponse } from './auth';

export interface IShopUserResponse {
  users: IUserInfoResponse[];
  count: number;
  hasNext: boolean;
}

export interface ICreateUser {
  userName: string;
  password: string;
  email?: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  contactNo: string;
  shopId: string;
}

interface IUserRoleCreate {
  userId: string;
  roleId: number;
}

export interface IChangeUserRoles {
  create: IUserRoleCreate[];
  delete: string[];
}
