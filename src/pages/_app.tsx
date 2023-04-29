import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
// @ts-ignore
import { theme } from "mui-minimal-theme";
import { Layout } from "@/modules/common";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SnackbarProvider } from "notistack";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persistor = persistStore(store);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider maxSnack={3}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SnackbarProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
