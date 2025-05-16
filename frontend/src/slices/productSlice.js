import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts(state, action) {
            state.items = action.payload;
        },
        addProduct(state, action) {
            state.items.push(action.payload);
        },
        removeProduct(state, action) {
            state.items = state.items.filter(item => item._id !== action.payload);
        }
    }
})

export const { setProducts, addProduct, removeProduct } = productSlice.actions;

export default productSlice.reducer;