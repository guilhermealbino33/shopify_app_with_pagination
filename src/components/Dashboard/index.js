import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Dashboard } from './Dashboard.jsx';
import { totalProductCount, publishedProductCount, createdAfter16MayProductCount } from '../../store/rootReducer/selectors.js';
import { getAllCountProduct, getPublishedCountProduct, getCreadtedAfter16MayCountProduct } from '../../store/rootReducer/actions.js';

const mapDispatchToProps = {
    getAllCountProduct,
    getPublishedCountProduct,
    getCreadtedAfter16MayCountProduct
};

const mapStateToProps = createStructuredSelector({
    totalProductCount,
    publishedProductCount,
    createdAfter16MayProductCount
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);