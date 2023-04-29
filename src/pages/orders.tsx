import { DataTable } from "@/modules/common";
import { DashboardContainerStyled } from "@/modules/dashboard";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
} from "@/redux/services/order.service";
import { setOrders } from "@/redux/slices/auth.slice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

export enum OrderStatus {
  PENDING = "PENDING",
  PICKED_UP = "PICKED_UP",
  DROPPED_OFF = "DROPPED_OFF",
}

const headers = [
  { id: "parcel", label: "Parcel Name" },
  { id: "pickup", label: "Pick-Up Time" },
  { id: "dropoff", label: "Drop-Off Time" },
  { id: "status", label: "Status" },
  { id: "action", label: "" },
];

function Orders() {
  const [open, setOpen] = useState(false);
  const [updateOrder, { isLoading: isUpdatingOrder }] =
    useUpdateOrderMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickDelivered = async () => {
    try {
      const { error } = await updateOrder({
        id: selectedOrder?.id,
        status: OrderStatus.DROPPED_OFF,
      }).unwrap();

      if (error) {
        throw error;
      }

      enqueueSnackbar("Order updated successfully", { variant: "success" });
      handleClose();
    } catch (err) {
      enqueueSnackbar("Error updating order", { variant: "error" });
      handleClose();
    }
  };

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state?.auth?.user);
  const [selectedOrder, setSelectedOrder] = useState<any>();

  const { data, isLoading } = useGetAllOrdersQuery({} as unknown as void, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setOrders({ orders: data || [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const renderOrders = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (!user?.orders || user?.orders.length === 0) {
      return <p>No orders found</p>;
    }

    const rows = user?.orders?.map((order) => ({
      id: order.id,
      pickup: dayjs(order.pickupTime).format("DD/MM/YYYY HH:mm"),
      dropoff: dayjs(order.dropoffTime).format("DD/MM/YYYY HH:mm"),
      parcel: order.parcel.name,
      status:
        order.status === OrderStatus.DROPPED_OFF ? (
          <Typography color="green">Delivered</Typography>
        ) : (
          "Picked Up"
        ),
      action:
        order.status === OrderStatus.DROPPED_OFF ? null : (
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedOrder(order);
              handleClickOpen();
            }}
          >
            Delivered!
          </Button>
        ),
    }));

    return <DataTable rows={rows} headers={headers} />;
  };

  return (
    <DashboardContainerStyled>
      <Box>{renderOrders()}</Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure that you've delivered "${selectedOrder?.parcel?.name}"?`}
        </DialogTitle>
        <DialogContent>{isUpdatingOrder && <LinearProgress />}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleClickDelivered} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainerStyled>
  );
}

export default Orders;
