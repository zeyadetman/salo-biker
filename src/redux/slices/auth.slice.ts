import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IOrder } from "@/modules/dashboard";

export enum userType {
  SENDER = "SENDER",
  BIKER = "BIKER",
}

export interface IAddress {
  address: string;
  id: string;
}

export interface IUserParcel {
  id: string;
  name: string;
  pickup: IAddress;
  dropoff: IAddress;
}

export interface User {
  id: number;
  name: string;
  email: string;
  type: userType;
  orders: any[];
}

type AuthState = {
  user: User | null;
  accessToken: string | null;
  parcels: IUserParcel[];
};

const slice = createSlice({
  name: "auth",
  initialState: { user: null, accessToken: null, parcels: [] } as AuthState,
  reducers: {
    setToken: (
      state,
      { payload: { accessToken } }: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = accessToken;
    },
    setUser: (state, { payload: { user } }: PayloadAction<{ user: User }>) => {
      state.user = user;
    },
    logout: (state) => {
      state.user = {} as User;
      state.accessToken = null;
    },
    setParcels: (
      state,
      {
        payload: { parcels },
      }: PayloadAction<{ parcels: (IUserParcel | any)[] }>
    ) => {
      state!.parcels = parcels;
    },
    setOrders: (
      state,
      { payload: { orders } }: PayloadAction<{ orders: any[] }>
    ) => {
      state.user!.orders = orders;
    },
  },
});

export const { setToken, setUser, logout, setParcels, setOrders } =
  slice.actions;
export default slice.reducer;
