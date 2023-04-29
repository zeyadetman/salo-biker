import { DataTable } from "@/modules/common";
import {
  DashboardContainerStyled,
  EmptyParcelsContainerStyled,
} from "@/modules/dashboard";
import { useGetAllParcelsQuery } from "@/redux/services/parcel.sercice";
import { setParcels } from "@/redux/slices/auth.slice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Typography, Box } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";

function User() {
  const user = useAppSelector((state: RootState) => state?.auth?.user);
  const { data } = useGetAllParcelsQuery({} as unknown as void, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useAppDispatch();
  const parcels = user?.parcels;
  const isParcelsEmpty = !parcels || parcels.length === 0;

  useEffect(() => {
    console.log("data", { data });
    if (data) {
      dispatch(setParcels({ parcels: [...(data || [])] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const renderParcels = () => {
    if (isParcelsEmpty) {
      return (
        <EmptyParcelsContainerStyled>
          <Image
            src="/assets/empty-parcels.svg"
            alt="Empty"
            width="600"
            height="300"
          />
          <Box className="emptyStateText">
            <Typography variant="body1">
              No parcels to pick up. Please wait for new parcels!
            </Typography>
          </Box>
        </EmptyParcelsContainerStyled>
      );
    }

    return (
      <DataTable
        rows={parcels}
        onRowActionClicked={(row) => {
          console.log(row.id);
        }}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Parcels Managment</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DashboardContainerStyled>
        <Typography variant="h2">Hi {user?.name},</Typography>

        <Box>{renderParcels()}</Box>
      </DashboardContainerStyled>
    </>
  );
}

export default User;
