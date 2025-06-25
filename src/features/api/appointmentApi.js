import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";



const APPOINTMENT_API="https://backend-df5y.onrender.com/api/v1/appointments/";

export const appointmentApi = createApi({
    reducerPath: "appointmentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: APPOINTMENT_API,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    }),

    endpoints: (builder) => ({
        createAppointment: builder.mutation({
            query: (inputData) => ({
                url: "create",
                method: "POST",
                body: inputData,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const response = await queryFulfilled;
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        getDoctorAppointments: builder.query({
            query: (doctorId) => ({
                url: `doctor/appointments/${doctorId}`,
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const response = await queryFulfilled;
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        getUserAppointments: builder.query({
            query: (userId) => ({
                url: `user/appointments/${userId}`,
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const response = await queryFulfilled;
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});

export const {
    useCreateAppointmentMutation,
    useGetDoctorAppointmentsQuery,
    useGetUserAppointmentsQuery
} = appointmentApi;