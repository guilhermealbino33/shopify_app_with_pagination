import { createAction } from 'redux-actions';

const createRequestAction = (type, payloadCreator) => {
    const action = createAction(type, (...args) => ({
        request: payloadCreator(...args)
    }));

    action.success = action + '_SUCCESS';
    action.fail = action + '_FAIL';
    return action;
};

export const getAllCountProduct = createRequestAction('ALL_PRODUCTS', ()=>({
    method: 'post',
    url: '/rest',
    data: {url: 'https://vapecloudstore13.myshopify.com/admin/api/2022-04/products/count.json'}
}));

export const getPublishedCountProduct = createRequestAction('PUBLISHED_PRODUCTS', ()=>({
    method: 'post',
    url: '/rest',
    data: {url: 'https://vapecloudstore13.myshopify.com/admin/api/2022-04/products/count.json?published_status=published'}
}));

export const getCreadtedAfter16MayCountProduct = createRequestAction('AFTER_16_MAY_PRODUCTS', ()=>({
    method: 'post',
    url: '/rest',
    data: {url: 'https://vapecloudstore13.myshopify.com/admin/api/2022-04/products/count.json?created_at_min=2022-05-16'}
}));