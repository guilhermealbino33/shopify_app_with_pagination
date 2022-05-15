import {
  Card,
  ResourceList,
  Pagination,
  Avatar,
  ResourceItem,
  TextStyle,
  Filters,
  ChoiceList,
  TextField
} from "@shopify/polaris";
import { useLazyQuery } from "@apollo/client";

import { GET_PRODUCTS } from "../graphql/requestString";
import { useCallback, useEffect, useState } from "react";
import { Loading, useClientRouting, useRoutePropagation } from "@shopify/app-bridge-react";
import ErrorBannerComponent from "./ErrorBannerComponent";
import { before } from "lodash";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// Variable for debouncing function with react hooks 
let timeout;

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [getSomeData, { loading, data, error, previousData }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "no-cache"
  });
  // Use location
  const location = useLocation();
  const navigate = useNavigate();

  // Our filters value
  const [sortValue, setSortValue] = useState(false);
  const [taggedWith, setTaggedWith] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  const [sortType, setSortType] = useState(null);

  useEffect(() => {
    getSomeData({ variables: { first: 5, reverse: sortValue } });
  }, []);
  
  // Handle for products pagination
  const getPrevPageProducts = useCallback((data) => {
    const cursor = data.products.edges[0].cursor;
    getSomeData({ variables: { last: 5, before: cursor, reverse: sortValue } });
  }, [data]);
  const getNextPageProducts = useCallback((data) => {
    const cursor = data.products.edges[data.products.edges.length - 1].cursor;
    getSomeData({ variables: { first: 5, after: cursor, reverse: sortValue } });
  }, [data]);


  function queryRequest(first, last, after, before, reverse, sortKey, title, tag) {
    switch (true) {
      case (title && tag):
        console.log("Title and tag are exist");
        getSomeData({ variables: { first: first, last: last, after: after, before: before, reverse: reverse, sortKey: sortKey, query: `(title:${title}*) AND (tag:${tag})` } })
        break;

      case (title && !tag):
        console.log("Title exist");
        getSomeData({ variables: { first: first, last: last, after: after, reverse: reverse, sortKey: sortKey, query: `title:${title}*` } })
        break;

      case (tag && !title):
        console.log("Tag exist");
        getSomeData({ variables: { first: first, last: last, after: after, reverse: reverse, sortKey: sortKey, query: `tag:${tag}*` } })
        break;

      default:
        console.log("Title and tag are empty");
        getSomeData({ variables: { first: first, last: last, after: after, reverse: reverse, sortKey: sortKey, query: null } })
        break;
    }
  }

  // Handle for change filters value
  // Sort by Newest OR Oldest
  const handleSortValueChange = useCallback((value) => {
    const sortValueBoolean = (value === "true");
    setSortValue(sortValueBoolean);
    queryRequest(5, null, null, null, sortValueBoolean, sortType, queryValue, taggedWith);
  }, [queryValue, sortValue, sortType, taggedWith]);

  // Sort by Alphabet or Price
  const handleSortTypeChange = useCallback((value) => {
    const sortTypeString = value[0];
    setSortType(sortTypeString);
    queryRequest(5, null, null, null, sortValue, sortTypeString, queryValue, taggedWith);
  }, [queryValue, sortValue, sortType, taggedWith]);

  // Filter by tags
  const handleTaggedWithChange = useCallback((value) => {
    setTaggedWith(value);
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
      queryRequest(5, null, null, null, sortValue, sortType, queryValue, value);
    }, 1000)
  }, [queryValue, sortValue, sortType, taggedWith]);

  // Filter by title
  const handleFiltersQueryChange = useCallback((value) => {
    setQueryValue(value);
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
      queryRequest(5, null, null, null, sortValue, sortType, value, taggedWith);
    }, 1000)
  }, [queryValue, sortValue, sortType, taggedWith]);

  // Handlers for remove filters
  const handleSortTypeRemove = useCallback(() => setSortType(null), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);

  const handleFiltersClearAll = useCallback(() => {
    handleSortTypeRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleSortTypeRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  // FILTER part START---------------------------------------------------------------------------------------------------------
  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
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
    {
      key: "sortType",
      label: "Sorting type",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: "Alphabet", value: "TITLE" },
            { label: "Price", value: "PRICE" }
          ]}
          selected={sortType || []}
          onChange={handleSortTypeChange}
        />
      ),
      shortcut: true,
    }
  ]

  const appliedFilters = [];
  if (!isEmpty(sortType)) {
    const key = "sortType";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, sortType),
      onRemove: handleSortTypeRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }
  // FILTER part END-----------------------------------------------------------------------------------------------------------

  if (error) {
    return <ErrorBannerComponent error={error} />
  }

  if (!previousData && !data) return <Loading />;

  return (
    <Card sectioned>
      < ResourceList
        loading={loading}
        filterControl={
          <Filters
            queryPlaceholder="Start enter product title"
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleQueryValueRemove}
          />
        }
        sortValue={sortValue}
        sortOptions={[
          { label: "Newest", value: true },
          { label: "Oldest", value: false },
        ]}
        onSortChange={handleSortValueChange}
        resourceName={{ singular: "customer", plural: "customers" }}
        items={loading || !data
          ? previousData ? previousData.products.edges.map((el) => { return el.node }) : []
          : data.products.edges.map((el) => { return el.node })}
        renderItem={(item) => {
          const { id, title } = item;
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
        hasPrevious={data && !loading ? data.products.pageInfo.hasPreviousPage : false}
        onPrevious={() => getPrevPageProducts(data)}
        hasNext={data && !loading ? data.products.pageInfo.hasNextPage : false}
        onNext={() => getNextPageProducts(data)}
      />
    </Card>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      case "sortType":
        return `Sort by ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}