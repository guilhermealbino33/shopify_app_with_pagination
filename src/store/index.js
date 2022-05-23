import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice";

export default configureStore({
    reducer: {
        dashboard: dashboardReducer
    }
});