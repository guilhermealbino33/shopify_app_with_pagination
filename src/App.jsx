import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
  TitleBar
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect, NavigationMenu, AppLink } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProductsList } from "./components/ProductsList";
import { ProductsItem } from "./components/ProductsItem";
import { Dashboard } from "./components/Dashboard";
import { CreateProduct } from "./components/CreateProduct";
import { Navigation } from "./components/Navigation";

export default function App() {

  const primaryAction = { content: 'Foo', url: '/foo' };
  const secondaryActions = [{ content: 'Bar', url: '/bar', loading: true }];
  const actionGroups = [{ title: 'Baz', actions: [{ content: 'Baz', url: '/baz' }] }];


  return (
    <BrowserRouter>
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider
          config={{
            apiKey: process.env.SHOPIFY_API_KEY,
            host: new URL(location).searchParams.get("host"),
            forceRedirect: true,
          }}
        >
          <MyProvider>
            <Navigation />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductsList />} />
              <Route path="/products/:id" element={<ProductsItem />} />
              <Route path="/create" element={<CreateProduct />} />
            </Routes>
          </MyProvider>
        </AppBridgeProvider>
      </PolarisProvider>
    </BrowserRouter>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
