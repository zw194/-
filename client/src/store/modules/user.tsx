import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserModel, UserTags, UserPages, UserParams } from '../type/type';
// import request from '../../utils/request';
import { RootDispatch } from '../index';
import API from '../../utils';

interface UserState {
  userInfo: UserModel[];
  tagList: UserTags[];
  pageInfo: UserPages;
  params: UserParams;
}

const initialState: UserState = {
  userInfo: [{id : '1', name: '1', description: '1', tags: ['1', '124'], time: 2000-1}],
  tagList: [],
  pageInfo: {
    pageNo: 0,
    pageSize: 0,
    total: 0,
  },
  // 查询参数
  params: {
    pageNo: 1,
    pageSize: 5,
    name: '',
    tags: [],
    startTime: '',
    endTime: '',
  },
};

const userStore = createSlice({
  name: 'user',
  // 数据状态
  initialState,
  // 同步修改方法
  reducers: {
    setUserInfo(state, action: PayloadAction<UserModel[]>) {
      state.userInfo = action.payload;
    },
    setTags(state, action: PayloadAction<UserTags[]>) {
      state.tagList = action.payload;
    },
    setPageInfo(state, action: PayloadAction<UserPages>) {
      state.pageInfo = action.payload;
      // console.log(state.pageInfo);
    },
    setUserParams(state, action: PayloadAction<UserParams>) {
      state.params = action.payload;
    },
  },
});

// 解构出actionCreater
const { setUserParams, setUserInfo, setTags, setPageInfo } = userStore.actions;

// 获取reducer函数
const userReducer = userStore.reducer;
const fetchUserInfo = (params: UserParams) => {
  return async (
    dispatch: RootDispatch
  ) => {
    try {
      const res = await API.getData(params);
      if(res.data)
      {
        dispatch(setUserInfo(res.data.data.dataInfo));
      dispatch(setPageInfo(res.data.data.pageInfo));
      }
      
    } catch {
      console.error('Error fetching user info:');
    }
  };
};
const fetchTags = () => {
  return async (
    dispatch: RootDispatch
  ) => {
    try {
      const res = await API.getTags();
      console.log(res);
      if(res.data){
         dispatch(setTags(res.data.data));
      }
     
    } catch {
      console.error('Error fetching tags:');
    }
  };
};

export { fetchUserInfo, fetchTags, setUserParams };

export default userReducer;
