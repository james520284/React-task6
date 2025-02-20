import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './slice/toastSlice';

const store = configureStore({
    reducer:{
        toastStorage:toastReducer,
    }
});

export default store;