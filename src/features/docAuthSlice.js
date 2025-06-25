import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    doctor: null,
    isAuthenticated: false,
    docDetail:null
};

const docAuthSlice = createSlice({
    name: 'docAuth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isAuthenticated = true;
            state.doctor = action.payload.doctor;
        },
        logout(state) {
            state.doctor = null;
            state.isAuthenticated = false;
            state.docDetail = null; // Reset docDetail on logout
        },
        docDetail(state, action) {
            state.docDetail = action.payload.docDetail;
        }
    },
});

export const {loginSuccess, logout, docDetail} = docAuthSlice.actions;

export default docAuthSlice.reducer;