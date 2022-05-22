import { configureStore } from "@reduxjs/toolkit";
import axiosMiddleware from "redux-axios-middleware";

import dashboardReducer from "./dashboardSlice";
import axiosClient from "./middlewares/axiosMiddleware";

export default configureStore({
    reducer: {
        dashboard: dashboardReducer
    },
    middleware: [axiosMiddleware(axiosClient)]
});