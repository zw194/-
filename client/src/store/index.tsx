import { configureStore } from '@reduxjs/toolkit';

import userReducer from './modules/user';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    // 注册子模块
    user: userReducer,
  },
});

// redux同步方法的类型
export type RootState = ReturnType<typeof store.getState>;

// redux异步方法的类型
export type RootDispatch = typeof store.dispatch;

export const useAppDispatch: () => RootDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store;
