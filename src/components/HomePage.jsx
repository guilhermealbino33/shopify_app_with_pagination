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
  Filters,
  Button
} from "@shopify/polaris";
import { useLazyQuery } from '@apollo/client';

import { GET_PRODUCTS } from "../graphql/requestString";
import { useCallback, useEffect, useState } from "react";

export function HomePage() {
  const [getSomeData, { loading, data, error }] = useLazyQuery(GET_PRODUCTS);
  // Our filters value
  const [sortValue, setSortValue] = useState(false);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);

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
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);
  const findProductsByTagOrTitle = useCallback(() => {
    getSomeData({ variables: { first: 5, reverse: sortValue, query: `(title:${queryValue}) OR (tag:${taggedWith})` } }).catch((err) => { console.log(err); })
  }, []);
  const backToAllProducts = useCallback(() => {
    getSomeData({ variables: { first: 5, reverse: sortValue } })
  }, [])
  const filters = [
    {
      key: 'taggedWith1',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
      {
        key: 'taggedWith1',
        label: disambiguateLabel('taggedWith1', taggedWith),
        onRemove: handleTaggedWithRemove,
      },
    ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={setQueryValue}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{ marginLeft: '8px' }}>
        <Button onClick={() => {
          findProductsByTagOrTitle()
        }}>Find</Button>
        <Button onClick={() => {
          backToAllProducts();
        }}>Back to all</Button>
      </div>
    </Filters>
  );

  if (error) {
    console.log(error)
    return (
      <Banner
        title="Something go wrong"
        action={{ content: 'Review risk analysis' }}
        status="critical"
      >
        <p>
          {error}
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
    <Card sectioned>
      < ResourceList
        filterControl={filterControl}
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

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith1':
        return `${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}