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
import { useAppBridge } from "@shopify/app-bridge-react";


export const Dashboard = () => {
    const [productCount, setProductCount] = useState(0);

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);
    async function updateProductCount() {
        const { count } = await fetch("/products/count").then((res) => res.json());
        setProductCount(count);
    }
    useEffect(() => {
        updateProductCount();
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
            <Card title='Product created after 10 may' sectioned></Card>
        </Page>
    )
}