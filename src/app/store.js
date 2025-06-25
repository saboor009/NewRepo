import {configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './rootReducer';
import { authApi } from '../features/api/authApi';
import { docAuthApi } from '../features/api/docAuthApi';
import { appointmentApi } from '../features/api/appointmentApi';



// Configure Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'docAuth'], // only persist authentication states
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(
            authApi.middleware,
            docAuthApi.middleware,
            appointmentApi.middleware
        ),
});

// Create the persistor
export const persistor = persistStore(store);

const initializeApp = async () => {
    await store.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch: true}));
    await store.dispatch(docAuthApi.endpoints.loadDoctor.initiate({}, {forceRefetch: true}));
}

initializeApp();