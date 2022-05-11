import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
    query getProduct($amount: Int!) {
        products(first: $amount) {
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