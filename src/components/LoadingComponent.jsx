import React from 'react';
import { Frame, Loading } from '@shopify/polaris';

const LoadingComponent = () => {
    return (
        <div style={{ height: '100px' }}>
            <Frame>
                <Loading />
            </Frame>
        </div>
    )
}

export default LoadingComponent;