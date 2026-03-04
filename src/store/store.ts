import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        projects: projectReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
