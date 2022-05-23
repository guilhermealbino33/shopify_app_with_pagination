import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { createApp } from "@shopify/app-bridge";

const app = createApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    host: new URL(location).searchParams.get("host"),
    forceRedirect: true,
});

export const axiosMiddleware = (store) => (next) => (action) => {
    setInterceptors(store)
    return next(action)
}

export const setInterceptors = (store) => {
    if (!store) {
        return
    }

    axios.interceptors.request.use(async function (config) {
        return getSessionToken(app) // requires a Shopify App Bridge instance
            .then((token) => {
                // Append your request headers with an authenticated token
                config.headers["Authorization"] = `Bearer ${token}`;
                return config;
            });
    })
}

























const axiosClient = axios.create();
// Intercept all requests on this Axios instance
axiosClient.interceptors.request.use(async function (config) {
    const token = await getSessionToken(app) // requires a Shopify App Bridge instance
        ;
    // Append your request headers with an authenticated token
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});
// Export your Axios instance to use within your app
export default axiosClient;
