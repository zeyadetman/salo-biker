import { IOrder } from "@/modules/dashboard";
import { RootState } from "@/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
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
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<void, void>({
      query: () => "orders",
      providesTags: (result: any) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({
                type: "Orders" as const,
                id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    createOrder: builder.mutation({
      query: (orderForm: IOrder & { parcelId: string }) => ({
        url: `orders`,
        method: "POST",
        body: JSON.stringify(orderForm),
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});

export const { useCreateOrderMutation, useGetAllOrdersQuery } = orderApi;
export const {} = orderApi.endpoints;
