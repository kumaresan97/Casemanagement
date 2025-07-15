import * as React from "react";
import {
    createHashRouter,
    Navigate,
} from "react-router-dom";
import MainLayout from "../Layout/MainLayout/MainLayout";
import AllCases from "../pages/Allcases/AllCases";
import CaseDetails from "../pages/Allcases/CaseDetails";
import CaseInfo from "../pages/Allcases/Tabs/CaseInfo";
import CaseNotes from "../pages/Allcases/Tabs/CaseNotes";
import DiagnosticsCode from "../pages/Allcases/Tabs/DiagnosticsCode";
import Documents from "../pages/Allcases/Tabs/Documents";
import Eligibility from "../pages/Allcases/Tabs/Eligibility";
import TreatmentPlans from "../pages/Allcases/Tabs/TreatmentPlan";
import CreateNewCase from "../pages/CreateCase/CreateNewCase";
import Dashboard from "../pages/Dashboard/Dashboard";


const router = createHashRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "cases/new", element: <CreateNewCase mode="add" /> },
            { path: "AllCases", element: <AllCases /> },
            {
                path: "AllCases/:id",
                element: <CaseDetails />, // You can also directly pass CommonTabLayout if it's static
                children: [
                    { index: true, element: <Navigate to="case-info" replace /> },
                    { path: "case-info", element: <CaseInfo /> },
                    { path: "eligibility", element: <Eligibility /> },
                    { path: "documents", element: <Documents /> },
                    { path: "diagnostics", element: <DiagnosticsCode /> },
                    { path: "treatment", element: <TreatmentPlans /> },
                    { path: "notes", element: <CaseNotes /> },
                ],
            },
        ],
    },
]);

export default router;
