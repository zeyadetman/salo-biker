import { FormStyled } from "@/modules/auth/styles";
import {
  Box,
  Button,
  FormHelperText,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie-parcel-success.json";
import { useSnackbar } from "notistack";
import { useCreateOrderMutation } from "@/redux/services/order.service";
import { DateValidationError, MobileDateTimePicker } from "@mui/x-date-pickers";
import { IUserParcel } from "@/redux/slices/auth.slice";
import dayjs from "dayjs";
import { OrderFormStyled } from "@/modules/dashboard/styles";
import { CloseOutlined } from "@mui/icons-material";

export interface IOrder {
  pickupDate: string;
  dropoffDate: string;
}

export const NewOrder = ({
  parcel,
  handleClose,
}: {
  parcel?: IUserParcel;
  handleClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}) => {
  const now = dayjs();
  const [error, setError] = useState<DateValidationError | null>(null);
  const [dateTimePickerForm, setDateTimePickerForm] = useState<IOrder | any>({
    pickupDate: now,
    dropoffDate: now.add(1, "days"),
  });
  const { enqueueSnackbar } = useSnackbar();
  const [createOrder, { isLoading: isSubmitting, isSuccess }] =
    useCreateOrderMutation();

  const errorMessage = useMemo(() => {
    switch (error) {
      case "maxDate":
      case "minDate": {
        return "Please select a date between the pickup and the dropoff dates";
      }

      case "invalidDate": {
        return "Your date is not valid";
      }

      default: {
        return "";
      }
    }
  }, [error]);

  const handleCreateOrder = async (values: IOrder) => {
    if (!parcel) {
      enqueueSnackbar("Please select a parcel to create an order!", {
        variant: "error",
      });

      return;
    }

    const order: IOrder & { parcelId: string } = {
      parcelId: parcel?.id,
      dropoffDate: dayjs(values?.dropoffDate)?.toISOString(),
      pickupDate: dayjs(values?.pickupDate)?.toISOString(),
    };

    try {
      const { error } = (await createOrder(order)) as any;
      if (error) {
        enqueueSnackbar(error?.data?.message || "Something went Wrong!", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar(
        (err as any)?.data?.message ||
          (err as any)?.message ||
          "Something went Wrong!",
        {
          variant: "error",
        }
      );
    }
  };

  if (isSuccess) {
    return (
      <OrderFormStyled>
        <Lottie
          animationData={animationData}
          loop={false}
          style={{ width: "200px" }}
        />
        <Typography variant="subtitle1">Order Created Successfully!</Typography>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </OrderFormStyled>
    );
  }

  return (
    <OrderFormStyled>
      <Box className="header">
        <Typography variant="h4">New Order: {parcel?.name}</Typography>
        <Typography variant="subtitle1" textAlign="center">
          {parcel?.pickup.address} - {parcel?.dropoff.address}
        </Typography>
      </Box>

      <Formik
        initialValues={dateTimePickerForm}
        validate={(values: IOrder) => {
          const errors: Partial<IOrder> = {};

          if (!values.pickupDate) {
            errors.pickupDate = "Required";
          }

          if (!values.dropoffDate) {
            errors.dropoffDate = "Required";
          }

          return errors;
        }}
        onSubmit={(values) => {
          if (!errorMessage) {
            handleCreateOrder(values);
          } else {
            enqueueSnackbar(errorMessage, { variant: "error" });
          }
        }}
      >
        {({ submitForm, setFieldValue, errors }) => (
          <Form>
            <FormStyled>
              <Field
                component={MobileDateTimePicker}
                name="pickupDate"
                label="Pick-Up Date"
                minDate={now}
                defaultValue={dateTimePickerForm.pickupDate}
                onChange={(value: any) => {
                  setFieldValue("pickupDate", value);
                  setDateTimePickerForm({
                    ...dateTimePickerForm,
                    pickupDate: value,
                  });
                }}
                onError={(newError: any) => setError(newError)}
                disabled={isSubmitting}
              />

              <Field
                component={MobileDateTimePicker}
                name="dropoffDate"
                label="Drop-Off Date"
                defaultValue={dateTimePickerForm.dropoffDate}
                onChange={(value: any) => {
                  setFieldValue("dropoffDate", value);
                  setDateTimePickerForm({
                    ...dateTimePickerForm,
                    dropoffDate: value,
                  });
                }}
                onError={(newError: any) => setError(newError)}
                minDate={dateTimePickerForm.pickupDate}
                disabled={isSubmitting}
              />

              <FormHelperText color="error" error>
                {errors.dropoffDate || errorMessage}
              </FormHelperText>

              {isSubmitting && <LinearProgress />}
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                sx={{ width: "100%", minHeight: "4rem" }}
              >
                Pick it up!
              </Button>
              <Button
                variant="outlined"
                color="primary"
                disabled={isSubmitting}
                onClick={handleClose}
                sx={{ width: "100%" }}
              >
                Cancel
              </Button>
            </FormStyled>
          </Form>
        )}
      </Formik>
    </OrderFormStyled>
  );
};
