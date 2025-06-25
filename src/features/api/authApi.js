import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { loginSuccess, logout } from "../authSlice";


const USER_API="https://backend-df5y.onrender.com/api/v1/users/";
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body:inputData,
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const response = await queryFulfilled;
                    dispatch(loginSuccess({user:response.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body:inputData,
            }),
        }),
        loadUser: builder.query({
            query: ()=>({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const response = await queryFulfilled;
                    dispatch(loginSuccess({user:response.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        logout: builder.mutation({
            query: ()=>({
                url:"logout",
                method:"GET"
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    }),
});

export const {useRegisterUserMutation,useLoginUserMutation,useLoadUserQuery,useLogoutMutation} = authApi
