import {
  Card,
  ResourceList,
  Pagination,
  Avatar,
  ResourceItem,
  TextStyle,
  Loading,
  Frame,
  Banner,
  TextField,
  Button,
  Layout
} from "@shopify/polaris";
import { useLazyQuery } from '@apollo/client';

import { GET_PRODUCTS } from "../graphql/requestString";
import { useCallback, useEffect, useState } from "react";
import ErrorBannerComponent from "./ErrorBannerComponent";
import LoadingComponent from "./LoadingComponent";

export function HomePage() {
  const [getSomeData, { loading, data, error }] = useLazyQuery(GET_PRODUCTS);
  // Our filters value
  const [sortValue, setSortValue] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    getSomeData({ variables: { first: 5, reverse: sortValue } });
  }, [])

  const getPrevPageProducts = useCallback((data) => {
    const cursor = data.products.edges[0].cursor;
    getSomeData({ variables: { last: 5, before: cursor, reverse: sortValue } });
  }, [data]);
  const getNextPageProducts = useCallback((data) => {
    const cursor = data.products.edges[data.products.edges.length - 1].cursor;
    getSomeData({ variables: { first: 5, after: cursor, reverse: sortValue } });
  }, [data]);
  const handleChange = useCallback((newValue) => setValue(newValue), []);
  const handleClearButtonClick = useCallback(() => setValue(''), []);
  const findByTagOrTitle = useCallback(() => {
    getSomeData({ variables: { first: 5, reverse: sortValue, query: `(title:${value}) OR (tag:${value})` } })
  }, [])

  if (error) {
    return <ErrorBannerComponent error={error}/>
  }

  if (loading || !data) {
    return <LoadingComponent />
  }

  return (
    <Card sectioned>
      <Layout>
        <TextField
          clearButton
          onClearButtonClick={handleClearButtonClick}
          align="left"
          value={value}
          onChange={handleChange}
          placeholder="Enter title or tag of product"
          autoComplete="off"
        />
        <div style={{ marginLeft: '8px' }}>
          <Button onClick={() => findByTagOrTitle()}>Save</Button>
        </div>
      </Layout>
      < ResourceList
        sortValue={sortValue}
        sortOptions={[
          { label: 'Newest', value: true },
          { label: 'Oldest', value: false },
        ]}
        onSortChange={(selected) => {
          const boolValue = (selected === 'true');
          setSortValue(boolValue);
          getSomeData({ variables: { first: 5, reverse: boolValue } });
        }}
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

      < Pagination
        hasPrevious={data.products.pageInfo.hasPreviousPage ? true : false}
        onPrevious={() => getPrevPageProducts(data)}
        hasNext={data.products.pageInfo.hasNextPage ? true : false}
        onNext={() => getNextPageProducts(data)}
      />
    </Card>
  );
}