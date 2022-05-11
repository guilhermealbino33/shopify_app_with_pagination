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

export const GET_NEXT_PRODUCTS = gql`
    query getNextFiveProducts($id: ID!) {
        products(first: 6, after: $id) {
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