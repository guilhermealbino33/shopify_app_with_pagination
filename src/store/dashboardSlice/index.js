import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllProductsCount = createAsyncThunk(
    'dashboard/getAllProductsCount',
    async function () {
        const response = await axios.post(
            '/rest',
            { url: 'https://vapecloudstore13.myshopify.com/admin/api/2022-04/products/count.json' }
        );
        console.log(response.status);
        const data = await response.data
        console.log(data);
        return data;
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        allProducts: 0,
        publishedProducts: 0,
        createdAfter16MayProducts: 0
    },
    reducers: {},
    extraReducers: {
        [getAllProductsCount.fulfilled]: (state, action) => {
            console.log(action);
            state.allProducts = action.payload;
        }
    }
});

export const { } = dashboardSlice.actions;
export default dashboardSlice.reducer;