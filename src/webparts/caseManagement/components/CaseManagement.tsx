/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from "react";
import { RouterProvider } from "react-router-dom";
// import MainLayout from '../../../Layout/MainLayout/MainLayout';
// import CreateNewCase from '../../../pages/CreateCase/CreateNewCase';
// import Dashboard from '../../../pages/Dashboard/Dashboard';
import { useDispatch } from "react-redux";
import {
  setCurrentUserDetails,
  setMainSPContext,
} from "../../../redux/feauture/dataSlicer";
// import AllCases from '../../../pages/Allcases/AllCases';
import router from "../../../routes/Routes";
import "../../../assets/css/style.css";
import { sp } from "@pnp/sp";

const CaseManagement = ({ context }: any) => {
  const dispatch = useDispatch();
  const init = () => {
    dispatch?.(setMainSPContext(context));
  };
  const fetchCurrentUserDetails = async () => {
    await sp.web.currentUser.get().then(async (currentUserDetails) => {
      // return {id : currentUserDetails?.Id,name:currentUserDetails?.Title,email:currentUserDetails?.Email}
      dispatch(
        setCurrentUserDetails({
          id: currentUserDetails?.Id,
          name: currentUserDetails?.Title,
          email: currentUserDetails?.Email,
        })
      );
    });
  };
  React.useEffect(() => {
    init();
    fetchCurrentUserDetails();
  }, []);
  return <RouterProvider router={router} />;
};
export default CaseManagement;
