import { FormStyled } from "@/modules/auth/styles";
import { useCreateParcelMutation } from "@/redux/services/parcel.sercice";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import React from "react";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie-parcel-success.json";
import { ParcelFormStyled } from "@/modules/dashboard/styles";
import { useSnackbar } from "notistack";

export interface IParcel {
  pickupAddress: string;
  dropoffAddress: string;
  name: string;
}

export const NewParcel = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createParcel, { isLoading: isSubmitting, isSuccess }] =
    useCreateParcelMutation();

  const handleCreateParcel = async (values: IParcel) => {
    try {
      await createParcel(values);
    } catch (err) {
      enqueueSnackbar((err as any).data.message || "Something went Wrong!", {
        variant: "error",
      });
    }
  };

  if (isSuccess) {
    return (
      <ParcelFormStyled>
        <Lottie
          animationData={animationData}
          loop={false}
          style={{ width: "200px" }}
        />
        <Typography variant="subtitle1">
          Parcel Created Successfully!
        </Typography>
      </ParcelFormStyled>
    );
  }

  return (
    <ParcelFormStyled>
      <Typography variant="h4">New Parcel</Typography>

      <Formik
        initialValues={{
          pickupAddress: "",
          dropoffAddress: "",
          name: "",
        }}
        validate={(values) => {
          const errors: Partial<IParcel> = {};

          if (!values.pickupAddress) {
            errors.pickupAddress = "Required";
          }

          if (!values.dropoffAddress) {
            errors.dropoffAddress = "Required";
          }

          if (!values.name) {
            errors.name = "Required";
          }
          return errors;
        }}
        onSubmit={(values) => {
          handleCreateParcel(values);
        }}
      >
        {({ submitForm }) => (
          <Form>
            <FormStyled>
              <Field
                component={TextField}
                name="pickupAddress"
                type="text"
                label="Pick-Up Address"
                disabled={isSubmitting}
              />
              <Field
                component={TextField}
                name="dropoffAddress"
                type="text"
                label="Drop-Off Address"
                disabled={isSubmitting}
              />
              <Field
                component={TextField}
                name="name"
                type="text"
                label="Parcel Name"
                disabled={isSubmitting}
              />
              {isSubmitting && <LinearProgress />}
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>
            </FormStyled>
          </Form>
        )}
      </Formik>
    </ParcelFormStyled>
  );
};
