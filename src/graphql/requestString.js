import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
    query getProduct($first: Int, $last: Int, $after: String, $before: String) {
        products(first: $first, last: $last, after: $after, before: $before) {
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