import { authApi } from "@/redux/services/auth.service";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "@/redux/slices/auth.slice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { parcelApi } from "@/redux/services/parcel.sercice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const reducers = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [parcelApi.reducerPath]: parcelApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([authApi.middleware, parcelApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
setupListeners(store.dispatch);
