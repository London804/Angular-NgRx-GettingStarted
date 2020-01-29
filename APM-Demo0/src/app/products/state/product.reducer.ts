import { Product } from '../product';
import * as fromRoot from './app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
    products: ProductState;
}

export interface ProductState {
    showProductCode: boolean;
    currentProduct: Product;
    products: Product[];
}

const initialState: ProductState = {
    showProductCode: true,
    currentProduct: null,
    products: []
};

const getProductFeatureState = createFeatureSelector<ProductState> ('products'); // this name is defined in the product.module.ts

export const getShowProductCode = createSelector(
    getProductFeatureState, // first argument is to grab the featureSelector so you know which piece of state you need
    state => state.showProductCode // this function gets the result
);

export const getCurrentProduct = createSelector(
    getProductFeatureState,
    state => state.currentProduct
);

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);

export function reducer(state = initialState, action): ProductState {
    switch (action.type) {
        case 'TOGGLE_PRODUCT_CODE':
            return {
                ...state,
                showProductCode: action.payload
            };

        default:
            return state;

    }
}
