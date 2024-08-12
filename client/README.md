项目的逻辑处理

| 文件夹      | 业务逻辑                               |
| ----------- | -------------------------------------- |
| src文件夹   | 业务逻辑放置的位置                     |
| store文件夹 | 使用redux管理状态，实现同步和异步处理  |
| route文件夹 | 使用createHashRouter实现路由结构的构建 |
| type文件夹  | 定义泛型结构                           |
| utils文件夹 | 封装axios,为其添加拦截器               |
| pages文件夹 | 路由组件的实现                             |

type文件夹中的其中一个泛型

```tsx
// 查询参数的类型
export interface UserParams {
  pageNo: number;
  pageSize: number;
  name: string;
  tags: string[];
  startTime: string;
  endTime: string;
}
```

实现数据列表展示时候，将列表和弹窗分离，同时通过父传子将弹窗所需要的状态传递,大致如下

```tsx
<Table></Table>
<UseModal
          modalType={modalType}
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          listData={listData}
        ></UseModal>
```

完善和补充后端接口

```jsx
// 定义标签路由
router.post('/api/data', addData);
router.get('/api/data', getData);
router.put('/api/data', editData);
router.delete('/api/data', delData);

// 定义切换语言接口
router.post('/api/lang', setLang);
router.get('/api/lang', getLang);

// 定义标签路由
router.post('/api/tags', addTag);
router.get('/api/tags', getTags);
router.put('/api/tags', editTag);
router.delete('/api/tags', delTag);
```

redux封装信息

```
onst userStore = createSlice({
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
    },
    setUserParams(state, action: PayloadAction<UserParams>) {
      state.params = action.payload;
    },
  },
});
//异步方法

//导出
export { fetchUserInfo, fetchTags, setUserParams };

export default userReducer;
```

**route模块**

```tsx
{
    path: '/',
    element: <Layout></Layout>, /主界面
    children: [
      {
        index: true,
        element: <Mark></Mark>, //笔记
      },
      {
        path: 'data',
        element: <Data></Data>, //数据管理
      },
      {
        path: 'label',
        element: <Label></Label>, //变迁管理
      },
    ],
  },
```

**pages模块**

search实现搜索功能

table列表展示 下面的modal文件夹实现弹窗

tagList文件实现标签管理 同样实现弹窗分离
