import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    appointment: null,
    isLoading: false,
    error: null,
};

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        createAppointmentStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        createAppointmentSuccess(state, action) {
            state.isLoading = false;
            state.appointment = action.payload;
            state.error = null;
        },
        createAppointmentFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const {
    createAppointmentStart,
    createAppointmentSuccess,
    createAppointmentFailure,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
