import { ILoginForm, IRegisterationForm } from "@/modules/auth";
import { IUserParcel, userType } from "@/redux/slices/auth.slice";
import { RootState } from "@/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parcelApi = createApi({
  reducerPath: "parcelApi",
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
  tagTypes: ["Parcels"],
  endpoints: (builder) => ({
    getAllParcels: builder.query<void, void>({
      query: () => "parcels",
      providesTags: (result: any) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({
                type: "Parcels" as const,
                id,
              })),
              { type: "Parcels", id: "LIST" },
            ]
          : [{ type: "Parcels", id: "LIST" }],
    }),
  }),
});

export const { useGetAllParcelsQuery } = parcelApi;
