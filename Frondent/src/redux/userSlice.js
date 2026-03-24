import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    order: ["heloo"],
    search: "",
    product: [],
    cartData: [],
    buyData: [],
    button: "",
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setOrder: (state, action) => {
            state.order = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setProduct: (state, action) => {
            state.product = action.payload;
        },
        setCartData: (state, action) => {
            state.cartData = action.payload;
        },
        setBuyData: (state, action) => {
            state.buyData = action.payload;
        },
        setButton: (state, action) => {
            state.button = action.payload;
        },
    },
});

export const {
    setOrder,
    setSearch,
    setProduct,
    setCartData,
    setBuyData,
    setButton
} = userSlice.actions;

export default userSlice.reducer;
