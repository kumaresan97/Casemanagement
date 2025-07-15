/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const mainData: any = {
  value: [],
  currentUserDetails: {
    id: "",
    name: "",
    email: "",
  },
};

const MainSPContext: any = createSlice({
  name: "MainSPContext",
  initialState: mainData,
  reducers: {
    setMainSPContext: (state, action) => {
      state.value = action?.payload;
    },
    setCurrentUserDetails: (state, payload) => {
      state.currentUserDetails = payload?.payload;
    },
  },
});

export const {
  setMainSPContext,
  setCurrentUserDetails,
  setAppDetails,
  setADGroupIDs,
} = MainSPContext.actions;
export default MainSPContext.reducer;
