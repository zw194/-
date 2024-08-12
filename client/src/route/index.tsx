import React,  { lazy, Suspense }  from 'react';
// import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Layout = lazy(() => import('../pages/layout'));
const Data = lazy(() => import('../pages/Data'));
const ListShow = lazy(() => import('../pages/tagList'));
// 路由懒加载
const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={'加载中'}><Layout></Layout></Suspense>,
    // element: <Layout></Layout>,
    children: [
      {
        index: true,
        element: <Suspense fallback={'加载中'}><Data></Data></Suspense>,
        // element: <Data></Data>,
      },
      {
        path: 'label',
        element: <Suspense fallback={'加载中'}><ListShow></ListShow></Suspense>,
        // element: <ListShow></ListShow>,
      },
    ],
  },
]);
export default router;
