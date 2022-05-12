import {
  Card,
  Page,
  Layout,
  ResourceList,
  Pagination,
  Avatar,
  ResourceItem,
  TextStyle,
  Loading,
  Frame,
  Banner,
  Link
} from "@shopify/polaris";
import { useLazyQuery } from '@apollo/client';

import { GET_PRODUCTS } from "../graphql/requestString";
import { ProductsCard } from "./ProductsCard";
import { useCallback, useEffect } from "react";

export function HomePage() {
  const [getSomeData, { loading, data, error, refetch }] = useLazyQuery(GET_PRODUCTS);

  useEffect(() => {

    getSomeData({ variables: { first: 5 } });
  }, [])

  const getPrevPageProducts = useCallback((data) => {
    const cursor = data.products.edges[0].cursor;
    getSomeData({ variables: { last: 5, before: cursor } });
  }, [data]);
  const getNextPageProducts = useCallback((data) => {
    const cursor = data.products.edges[data.products.edges.length - 1].cursor;
    getSomeData({ variables: { first: 5, after: cursor } });
  }, [data]);

  if (error) {
    console.log(error)
    return (
      <Banner
        title="Something go wrong"
        action={{ content: 'Review risk analysis' }}
        status="critical"
      >
        <p>
          Before fulfilling this order or capturing payment, please{' '}
          <Link url="">review the Risk Analysis</Link> and determine if this order is
          fraudulent.
        </p>
      </Banner>
    )
  }

  if (loading || !data) {
    return (
      <div style={{ height: '100px' }}>
        <Frame>
          <Loading />
        </Frame>
      </div>
    )
  }

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {/* Our section for products */}
            < ResourceList
              resourceName={{ singular: 'customer', plural: 'customers' }}
              items={data.products.edges.map((el) => { return el.node })}
              renderItem={(item) => {
                const { id, vendor, title, cursor } = item;
                const media = <Avatar customer size="medium" name={title} />;

                return (
                  <ResourceItem
                    id={id}
                    media={media}
                    accessibilityLabel={`View details for ${title}`}
                  >
                    <h3>
                      <TextStyle variation="strong">{title}</TextStyle>
                    </h3>
                    <div>{id}</div>
                  </ResourceItem>
                );
              }}
            />
            {/* Our pagination */}
            < Pagination
              hasPrevious={data.products.pageInfo.hasPreviousPage ? true : false}
              onPrevious={() => getPrevPageProducts(data)}
              hasNext={data.products.pageInfo.hasNextPage ? true : false}
              onNext={() => getNextPageProducts(data)}
            />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}


// data.products.edges.map((el) => { return el.node })
// 
// 