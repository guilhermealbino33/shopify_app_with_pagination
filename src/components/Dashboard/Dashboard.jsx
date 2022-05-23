import React from 'react';
import { useEffect } from 'react';
import {
    Page,
    Card,
    Heading,
    TextContainer,
    DisplayText,
    TextStyle
} from '@shopify/polaris';
import { useClientRouting, useRoutePropagation } from "@shopify/app-bridge-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsCount, getPublishedProductsCount, getProductsCreatedAfter16MayCount } from '../../store/dashboardSlice/index';


export const Dashboard = () => {
    const dispatch = useDispatch();
    const allProudctsCount = useSelector(state => state.dashboard. allProducts);
    const publishedProudctsCount = useSelector(state => state.dashboard. publishedProducts);
    const createdAfter16MayProudctsCount = useSelector(state => state.dashboard. createdAfter16MayProducts);
    
    // Use location
    const location = useLocation();
    const navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    useEffect(() => {
        dispatch(getAllProductsCount());
        dispatch(getPublishedProductsCount());
        dispatch(getProductsCreatedAfter16MayCount());
    }, []);

    return (
        <Page>
            <Card title='All count products' sectioned>
                <TextContainer spacing='loose'>
                    <Heading element="h4">
                        NUMBER OF EXISTING PRODUCTS
                        <DisplayText size="medium">
                            <TextStyle variation="strong">{allProudctsCount}</TextStyle>
                        </DisplayText>
                    </Heading>
                </TextContainer>
            </Card>
            <Card title='Published products' sectioned>
                <TextContainer spacing='loose'>
                    <Heading element="h4">
                        NUMBER OF PUBLISHED PRODUCTS
                        <DisplayText size="medium">
                            <TextStyle variation="strong">{publishedProudctsCount}</TextStyle>
                        </DisplayText>
                    </Heading>
                </TextContainer>
            </Card>
            <Card title='Product created after 16 may' sectioned>
                <TextContainer spacing='loose'>
                    <Heading element="h4">
                        NUMBER OF PRODUCTS WHICH CREATED AFTER 16 MAY
                        <DisplayText size="medium">
                            <TextStyle variation="strong">{createdAfter16MayProudctsCount}</TextStyle>
                        </DisplayText>
                    </Heading>
                </TextContainer>
            </Card>
        </Page>
    )
}