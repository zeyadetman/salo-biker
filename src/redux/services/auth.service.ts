import { ILoginForm, IRegisterationForm } from "@/modules/auth";
import { userType } from "@/redux/slices/auth.slice";
import { RootState } from "@/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    headers: {
      "Content-Type": "application/json",
    },
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.accessToken;
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMe: builder.query<void, void>({
      query: () => "users/me",
    }),
    register: builder.mutation({
      query: (registerationForm: IRegisterationForm) => ({
        url: `users`,
        method: "POST",
        body: JSON.stringify({
          ...registerationForm,
          type: userType.BIKER,
        }),
      }),
    }),
    login: builder.mutation({
      query: (loginForm: ILoginForm) => ({
        url: "auth/login",
        method: "POST",
        body: JSON.stringify(loginForm),
      }),
    }),
  }),
});

export const { useGetMeQuery, useRegisterMutation, useLoginMutation } = authApi;
export const { getMe: getMeApi } = authApi.endpoints;
