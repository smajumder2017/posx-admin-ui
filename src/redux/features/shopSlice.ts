import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IResponseError } from '../../models/common';
import { RequestStatus } from '../../utils/enums';

import * as api from './../../apis';
import { IShopResponse, IUpdateShopRequest } from '@/models/shop';

type SliceState<T> = {
  data: T | null;
  error: IResponseError | null;
  asyncStatus: RequestStatus;
};

const initialState: SliceState<IShopResponse> = {
  data: null,
  error: null,
  asyncStatus: RequestStatus.Init,
};

export const updateShopDetails = createAsyncThunk(
  'shop/updateShop',
  async (payload: IUpdateShopRequest, thunkApi) => {
    try {
      const response = await api.updateShop(payload);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

// export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
//   try {
//     const response = await api.logout();
//     return response;
//   } catch (error) {
//     return thunkApi.rejectWithValue(error);
//   }
// });

export const getShopDetails = createAsyncThunk(
  'shop/getShopDetails',
  async (shopId: string, thunkApi) => {
    try {
      const response = await api.fetchShopDetails(shopId);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateShopDetails.pending, (state, _action) => {
        state.asyncStatus = RequestStatus.Loading;
      })
      .addCase(updateShopDetails.fulfilled, (state, action) => {
        state.asyncStatus = RequestStatus.Success;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateShopDetails.rejected, (state, action) => {
        state.asyncStatus = RequestStatus.Failed;
        state.error = action.error;
      });

    builder
      .addCase(getShopDetails.pending, (state) => {
        state.asyncStatus = RequestStatus.Loading;
      })
      .addCase(getShopDetails.fulfilled, (state, action) => {
        state.asyncStatus = RequestStatus.Success;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(getShopDetails.rejected, (state, action) => {
        state.asyncStatus = RequestStatus.Failed;
        state.error = action.error;
      });
  },
});

export default shopSlice;
