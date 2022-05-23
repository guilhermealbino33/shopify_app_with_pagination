import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSessionToken } from "@shopify/app-bridge-utils";
import axios from "axios";
import { createApp } from "@shopify/app-bridge";

const app = createApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    host: new URL(location).searchParams.get("host"),
    forceRedirect: true,
});

export const getAllProductsCount = createAsyncThunk(
    'dashboard/getAllProductsCount',
    async function () {
        let authToken = null;
        await getSessionToken(app) // requires a Shopify App Bridge instance
            .then((token) => {
                authToken = token;
            })
        const request = await axios.post(
            '/rest',
            { url: 'https://vapecloudstore13.myshopify.com/admin/api/2022-04/products/count.json' },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        return request.data;
    }
);

export const getPublishedProductsCount = createAsyncThunk(
    'dashboard/getPublishedProductsCount',
    async function () {
        let authToken = null;
        await getSessionToken(app) // requires a Shopify App Bridge instance
            .then((token) => {
                authToken = token;
            })
        const request = await axios.post(
            '/rest',
            { url: 'https://vapecloudstore13.myshopify.com/admin/api/2022-04/products/count.json?published_status=published' },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        return request.data;
    }
);

export const getProductsCreatedAfter16MayCount = createAsyncThunk(
    'dashboard/getProductsCreatedAfter16MayCount',
    async function () {
        let authToken = null;
        await getSessionToken(app) // requires a Shopify App Bridge instance
            .then((token) => {
                authToken = token;
            })
        const request = await axios.post(
            '/rest',
            { url: 'https://vapecloudstore13.myshopify.com/admin/api/2022-04/products/count.json?created_at_min=2022-05-16' },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );
        return request.data;
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
            state.allProducts = action.payload.count;
        },
        [getPublishedProductsCount.fulfilled]: (state, action) => {
            console.log(action);
            state.publishedProducts = action.payload.count;
        },
        [getProductsCreatedAfter16MayCount.fulfilled]: (state, action) => {
            console.log(action);
            state.createdAfter16MayProducts = action.payload.count;
        }
    }
});

export const { } = dashboardSlice.actions;
export default dashboardSlice.reducer;