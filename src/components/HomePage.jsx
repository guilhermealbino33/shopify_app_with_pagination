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
  Frame
} from "@shopify/polaris";
import { useLazyQuery, useQuery } from '@apollo/client';

import { GET_PRODUCTS } from "../graphql/requestString";
import { ProductsCard } from "./ProductsCard";
import { useEffect, useState } from "react";

export function HomePage() {
  const [queryData, setData] = useState([{ id: '123', title: 'Test data1' }, { id: '223', title: 'Test data2' }]);
  // const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [getSomeData, { called, loading, error, data }] = useLazyQuery(GET_PRODUCTS);
  

  useEffect(() => {
    if (!loading) {

      getSomeData({ variables: { amount: 5 } });
      if (data) {
        setData(data.products.edges.map((el) => { return el.node }));
      }
    }
  }, [loading])

  // if (loading) {
  //   return (
  //     <Page fullWidth>
  //       <Layout>
  //         <Layout.Section>
  //           <Card sectioned>
  //             <Frame>
  //               <Loading />
  //             </Frame>
  //           </Card>
  //         </Layout.Section>
  //       </Layout>
  //     </Page>
  //   )
  // }

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {/* Our section for products */}
            < ResourceList
              resourceName={{ singular: 'customer', plural: 'customers' }}
              items={queryData}
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
              hasPrevious
              onPrevious={() => {
                getSomeData()
                setData([{ id: 'das', title: 'dassdsada' }])
              }}
              hasNext
              onNext={() => {
                console.log('Next');
              }}
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