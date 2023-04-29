import {
  Box,
  Button,
  LinearProgress,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useTheme } from "@mui/material/styles";
import React from "react";
import {
  FormContainerStyled,
  FormOverviewContainerStyled,
  FormStyled,
} from "@/modules/auth/styles";
import {
  authApi,
  getMeApi,
  useGetMeQuery,
  useLoginMutation,
} from "@/redux/services/auth.service";
import { useAppDispatch } from "@/redux/store";
import {
  logout,
  setToken,
  setUser,
  User,
  userType,
} from "@/redux/slices/auth.slice";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export interface ILoginForm {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const [login, { isLoading: isSubmitting }] = useLoginMutation();
  const [getMeInfo] = getMeApi.useLazyQuery();

  const handleLogin = async (values: ILoginForm) => {
    try {
      const accessToken: { accessToken: string } = await login(values).unwrap();
      dispatch(setToken(accessToken));
      const user: any = await getMeInfo();
      const isUserSender = user.data?.type === userType.BIKER;
      if (isUserSender) {
        dispatch(setUser({ user: user.data }));
        enqueueSnackbar(`Welcome Back, ${user.data?.name}`, {
          variant: "success",
        });
        router.push("/dashboard");
      } else {
        dispatch(logout());
        enqueueSnackbar("You are not a biker!", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar((err as any).data.message || "Something went Wrong!", {
        variant: "error",
      });
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validate={(values) => {
        const errors: Partial<ILoginForm> = {};

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
      onSubmit={(values) => {
        handleLogin(values);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <FormContainerStyled>
            <FormOverviewContainerStyled>
              <Typography variant="h4">Welcome Back</Typography>
              {isMobile ? null : (
                <>
                  <Typography variant="subtitle1" fontStyle="italic">
                    Sign in and start delivering
                  </Typography>
                </>
              )}
            </FormOverviewContainerStyled>
            <FormStyled>
              <Field
                component={TextField}
                disabled={isSubmitting}
                name="email"
                type="email"
                label="Email"
              />
              <Field
                component={TextField}
                disabled={isSubmitting}
                type="password"
                label="Password"
                name="password"
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
