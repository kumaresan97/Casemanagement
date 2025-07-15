// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
// import dataReducer from "../Reducer/dataSlice";
import dataSlicer from "../feauture/dataSlicer";

export const store: any = configureStore({
  reducer: { data: dataSlicer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
