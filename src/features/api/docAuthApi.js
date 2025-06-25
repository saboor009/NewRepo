import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {docDetail, loginSuccess,logout} from "../docAuthSlice";

const DOCTOR_API="https://backend-df5y.onrender.com/api/v1/doctors/";

export const docAuthApi = createApi({   
    reducerPath: "docAuthApi",
    baseQuery: fetchBaseQuery({
        baseUrl: DOCTOR_API,
        credentials: "include",
        // REMOVED the static headers object and replaced with prepareHeaders
        prepareHeaders: (headers, { body }) => {
            // If the request has a body and it's NOT FormData, set the Content-Type
            if (body && !(body instanceof FormData)) {
                headers.set('Content-Type', 'application/json');
            }
            // If it IS FormData, we do NOT set the Content-Type header.
            // The browser will automatically set it to 'multipart/form-data'
            // with the correct boundary, which is required for file uploads.
            return headers;
        },
    }),

    endpoints: (builder) => ({
        loginDoctor: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body:inputData,
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const response = await queryFulfilled;
                    dispatch(loginSuccess({doctor:response.data.doctor}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        registerDoctor: builder.mutation({
            query: (inputData) => ({ // inputData is expected to be a FormData object
                url: "register",
                method: "POST",
                body:inputData,
            }),
        }),

        logoutDoctor: builder.mutation({
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

        loadDoctor: builder.query({
            query: ()=>({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const response = await queryFulfilled;
                    dispatch(loginSuccess({doctor:response.data.doctor}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        getDocDetail: builder.query({
            query: (id)=>({
                url:`details/${id}`,
                method:"GET"
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const response = await queryFulfilled;
                    dispatch(docDetail({docDetail:response.data.doctor}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
     updateDoctor: builder.mutation({
            query: (inputData) => ({ // inputData is expected to be a FormData object
                url: "profile/update",
                method: "PUT",
                body: inputData,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const response = await queryFulfilled;
                    // Update the user's state with the new profile data
                    dispatch(loginSuccess({ doctor: response.data.doctor }));
                } catch (error) {
                    console.error("Failed to update doctor profile:", error);
                }
            },
        }),
    }),
});

export const {useRegisterDoctorMutation,useLoginDoctorMutation,useLogoutDoctorMutation,useLoadDoctorQuery,useGetDocDetailQuery,useUpdateDoctorMutation} = docAuthApi;