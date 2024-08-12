import React, { useEffect } from 'react';
import Search from '../search';
import { fetchUserInfo, fetchTags } from '../../store/modules/user';
import { useAppDispatch, useAppSelector } from '../../store';
import List from '../Table';

import './index.css';
const Data = () => {
  const { params } = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();
  // 会根据params的变化获取
  useEffect(() => {
    dispatch(fetchUserInfo(params));
    dispatch(fetchTags());
  }, []);
  // 你将获得的数据

  return (
    <div>
      <Search></Search>
      <List></List>
    </div>
  );
};

export default Data;
