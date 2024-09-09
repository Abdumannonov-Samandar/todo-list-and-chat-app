import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './reducer';
import chatReducer from './chatReducer';

const store = configureStore({
  reducer: {
    todos: todoReducer,
    chat: chatReducer,  // Add chatReducer directly under the 'reducer' object
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
