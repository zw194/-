import React from 'react';
// 返回的列表的数据类型
export interface UserModel {
  id: string;
  name: string;
  description: string;
  time: number;
  tags: string[];
}
// 返回标签的数据类型
export interface UserTags {
  id: string;
  name: string;
}

// 查询参数的类型
export interface UserParams {
  pageNo: number;
  pageSize: number;
  name: string;
  tags: string[];
  startTime: string;
  endTime: string;
}

//
export interface UserProps {
  params: UserParams;
  setParams: React.Dispatch<React.SetStateAction<UserParams>>;
}

export interface UserPages {
  pageNo: number;
  pageSize: number;
  total: number;
}

export interface UserLang {
  code: number;
  message: string;
  data: string;
}
