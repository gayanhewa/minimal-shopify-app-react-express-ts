import React, { useEffect, useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";


function userLoggedInFetch(app: any): any {
  const fetchFunction = authenticatedFetch(app);

  return async (uri: any, options: any) => {
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

const MyProvider = ({ children }: any) => {
  const app = useAppBridge();

  const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        credentials: "include",
        fetch: userLoggedInFetch(app),
      }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export const App = (): JSX.Element => {
    return (
        <PolarisProvider i18n={translations}>
          <AppBridgeProvider
            config={{
              apiKey: process.env.API_KEY,
              host: (new URLSearchParams(window.location.search)).get('host') as string,
              forceRedirect: true,
            }}
          >
            <MyProvider>
                <h1>Hello from admin</h1>
            </MyProvider>
          </AppBridgeProvider>
        </PolarisProvider>
      );
};
