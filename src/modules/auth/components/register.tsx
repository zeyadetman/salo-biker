import {
  Button,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie-register.json";
import successAnimationData from "@/assets/lottie-registeration-success.json";
import { useTheme } from "@mui/material/styles";
import React from "react";
import {
  FormContainerStyled,
  FormOverviewContainerStyled,
  FormStyled,
  SuccessfulRegisterationMessageStyled,
} from "@/modules/auth/styles";
import { useRegisterMutation } from "@/redux/services/auth.service";
import { useSnackbar } from "notistack";

export interface IRegisterationForm {
  email: string;
  name: string;
  password: string;
}

export const Register = ({
  handleLoginNavigation,
}: {
  handleLoginNavigation: () => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();
  const [register, { isLoading: isSubmitting, isSuccess }] =
    useRegisterMutation();

  const handleRegister = async (values: IRegisterationForm) => {
    try {
      const { error } = await register(values).unwrap();
      if (error) {
        throw error;
      }
    } catch (err: any) {
      enqueueSnackbar(
        err?.message || err?.data?.message || "Something went Wrong!",
        {
          variant: "error",
        }
      );
    }
  };

  if (isSuccess) {
    return (
      <SuccessfulRegisterationMessageStyled>
        <Lottie
          animationData={successAnimationData}
          loop={false}
          style={{
            maxWidth: "400px",
            height: "auto",
            margin: "0 auto",
          }}
        />
        <Button variant="contained" onClick={handleLoginNavigation}>
          Click here to login
        </Button>
      </SuccessfulRegisterationMessageStyled>
    );
  }

  return (
    <Formik
      initialValues={{
        email: "",
        name: "",
        password: "",
      }}
      validate={(values) => {
        const errors: Partial<IRegisterationForm> = {};
        if (!values.name) {
          errors.name = "Required";
        }

        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }

        if (!values.password) {
          errors.password = "Required";
        }
        return errors;
      }}
      onSubmit={(values: IRegisterationForm) => {
        handleRegister(values);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <FormContainerStyled>
            <FormOverviewContainerStyled>
              <Typography variant="h4">Join us</Typography>
              {isMobile ? null : (
                <>
                  <Typography variant="subtitle1" fontStyle="italic">
                    and start delivering
                  </Typography>
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{
                      height: "200px",
                    }}
                  />
                </>
              )}
            </FormOverviewContainerStyled>
            <FormStyled>
              <Field
                component={TextField}
                name="name"
                type="text"
                label="Name"
                disabled={isSubmitting}
              />
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                disabled={isSubmitting}
              />
              <Field
                component={TextField}
                type="password"
                label="Password"
                name="password"
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
          </FormContainerStyled>
        </Form>
      )}
    </Formik>
  );
};
