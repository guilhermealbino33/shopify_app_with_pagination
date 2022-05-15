import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
    query getProduct($first: Int, 
                     $last: Int, 
                     $after: String, 
                     $before: String, 
                     $reverse: Boolean, 
                     $query: String,
                     $sortKey: ProductSortKeys
                     ) {
        products(
                 first: $first, 
                 last: $last, 
                 after: $after, 
                 before: $before, 
                 reverse: $reverse, 
                 query: $query,
                 sortKey: $sortKey
                 ) {
            pageInfo {
                hasPreviousPage
                hasNextPage
            }
            edges {
                cursor
                node {
                    title
                    id
                }
            }
        }
    }
`;