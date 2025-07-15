import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
// import MainLayout from '../../../Layout/MainLayout/MainLayout';
// import CreateNewCase from '../../../pages/CreateCase/CreateNewCase';
// import Dashboard from '../../../pages/Dashboard/Dashboard';
import { useDispatch } from 'react-redux';
import { setMainSPContext } from '../../../redux/feauture/dataSlicer';
// import AllCases from '../../../pages/Allcases/AllCases';
import router from '../../../routes/Routes';
const CaseManagement = ({ context }: any) => {
  const dispatch = useDispatch()
  const init = () => {
    dispatch?.(setMainSPContext(context))

  }
  React.useEffect(() => {
    init()

  }, [])
  return (
    <RouterProvider router={router} />


  );
}
export default CaseManagement;