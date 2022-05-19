import React from 'react';
import { useEffect, useState } from 'react';
import {
    Page,
    Card,
    Heading,
    TextContainer,
    DisplayText,
    TextStyle
} from '@shopify/polaris';
import { userLoggedInFetch } from "../App";
import { useAppBridge, useClientRouting, useRoutePropagation } from "@shopify/app-bridge-react";
import { useLocation, useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [productCount, setProductCount] = useState(0);
    const [filterProductCount, setFilterProductCount] = useState(0)
    // Use location
    const location = useLocation();
    const navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);
    async function updateProductCount() {
        const { count } = await fetch("/products/count").then((res) => res.json());
        setProductCount(count);
    }
    async function updateFilterProductCount() {
        const { count } = await fetch("/rest").then((res) => res.json());
        setFilterProductCount(count);
    }
    useEffect(() => {
        updateProductCount();
        updateFilterProductCount();
    }, []);

    return (
        <Page>
            <Card title='All count products' sectioned>
                <TextContainer spacing='loose'>
                    <Heading element="h4">
                        NUMBER OF EXISTING PRODUCTS
                        <DisplayText size="medium">
                            <TextStyle variation="strong">{productCount}</TextStyle>
                        </DisplayText>
                    </Heading>
                </TextContainer>
            </Card>
            <Card title='Product created after 10 may' sectioned>
            <TextContainer spacing='loose'>
                    <Heading element="h4">
                        NUMBER OF EXISTING PRODUCTS
                        <DisplayText size="medium">
                            <TextStyle variation="strong">{filterProductCount}</TextStyle>
                        </DisplayText>
                    </Heading>
                </TextContainer>
            </Card>
        </Page>
    )
}