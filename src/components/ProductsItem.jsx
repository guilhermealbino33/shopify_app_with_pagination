import React, { useState } from 'react';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRoutePropagation, useClientRouting } from '@shopify/app-bridge-react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Button, ButtonGroup, Card, Frame, Layout, Loading, Page, TextField, Banner } from '@shopify/polaris';
import { GET_CHOOSEN_PRODUCT, UPDATE_CHOOSEN_PRODUCT } from '../graphql/requestString';

export const ProductsItem = () => {
    const [idNumber] = useState(useParams().id);

    const [getOneProduct, { data: queryData, loading: queryLoading, error: queryError }] = useLazyQuery(GET_CHOOSEN_PRODUCT, { variables: { id: 'gid://shopify/Product/' + idNumber } });
    const [mutateFunction, { loading: mutLoading, error: mutError, called: mutCalled }] = useMutation(UPDATE_CHOOSEN_PRODUCT);
    const [titleValue, setTitleValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');

    useEffect(() => {
        getOneProduct();
        if(queryData) {
            setTitleValue(queryData.product.title);
            setDescriptionValue(queryData.product.descriptionHtml);
        }
    }, [queryLoading])
    // Use location
    const location = useLocation();
    const navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });
    // For handle edit field value
    const handleChangeTitle = useCallback((newValue) => setTitleValue(newValue), []);
    const handleChangeDescription = useCallback((newValue) => setDescriptionValue(newValue), []);
    // For navigate useCallback 
    const backToAllProducts = useCallback(() => { navigate('/products') }, []);
    // For update our product
    const updateProduct = useCallback(() => {
        mutateFunction({
            variables: {
                input: {
                    id: `gid://shopify/Product/${idNumber}`,
                    title: titleValue,
                    descriptionHtml: descriptionValue
                }
            }
        }).then(()=>{
            getOneProduct();
        })
    }, [titleValue, descriptionValue, idNumber]);

    if (queryError || mutError) {
        console.log(queryError || mutError);
        return (
            <Banner status="critical">There was an issue loading product.</Banner>
        );
    }

    if (queryLoading) {
        return (
            <Frame>
                <Loading />
            </Frame>
        );
    }

    return (
        <Page
            title={queryData && !queryLoading? queryData.product.title : 'Title loading...'}
            subtitle={queryData && !queryLoading? queryData.product.descriptionHtml : 'Description loading...'}
        >
            <Card title="Change fields" sectioned>
                <Layout>
                    <Layout.Section>
                        <TextField
                            label="Title"
                            value={titleValue}
                            onChange={handleChangeTitle}
                            autoComplete="off"
                        />
                    </Layout.Section>
                    <Layout.Section>
                        <TextField
                            label="Description"
                            value={descriptionValue}
                            onChange={handleChangeDescription}
                            autoComplete="off"
                        />
                    </Layout.Section>
                    <Layout.Section>
                        <ButtonGroup>
                            <Button 
                            loading={queryLoading} 
                            disabled={false} 
                            onClick={updateProduct} primary>Save</Button>
                            <Button onClick={backToAllProducts} primary>Back to all products</Button>
                        </ButtonGroup>
                    </Layout.Section>
                </Layout>
            </Card>
        </Page>
    )
}