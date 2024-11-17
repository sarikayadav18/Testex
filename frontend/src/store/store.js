import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/AuthSlice";
import { TestSlice } from "./slices/TestSlice"; 

const store = configureStore({
    reducer : {
        auth : authSlice.reducer ,
        test: TestSlice.reducer,
    }
})

export default store;