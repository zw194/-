import React, { useEffect, useMemo, useRef } from 'react';
import { Space, Button, Table, Tag, Popconfirm, Tooltip, message } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import dayjs from 'dayjs';
import { UserModel } from '../../store/type/type';
import { fetchUserInfo, setUserParams } from '../../store/modules/user';
import UseModal from './modal';
import { ModalInstance } from '../../store/type/modal';
import API from '../../utils/index';
import './index.css';
const List: React.FC = () => {
  const { tagList, userInfo, pageInfo, params} = useAppSelector(
    state => state.user
  );
  const dispatch= useAppDispatch();
  // 添加定时器
  let timer: any;
  // 实现id 和 name 之间的映射 根据
  const tagsMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    tagList.forEach((tag) => {
      map[tag.id] = tag.name;
    });
    return map;
  }, [tagList]);
  
  const modalRef = useRef<ModalInstance>(null)

  useEffect(() => {
    timer = setTimeout(async () => {
      await dispatch(fetchUserInfo(params));  
    }, 800)
     return () => clearTimeout(timer)
  },[params])
  // 处理页面切换的逻辑
  const onPageChange = (page: number, pageSize: number) => {
    // console.log(page, '...', pageSize);
    // 切换每页多少条 最好第一页开始
    if(pageSize !== params.pageSize){
      dispatch(setUserParams({...params, pageNo: 1, pageSize, }))
    }
    else {
      dispatch(setUserParams({...params, pageNo: page, pageSize, }))
    }
  
  };
  // 删除逻辑
  const confirm = async (rowData: UserModel) => {
    try { 
      
      await API.delData({id: rowData.id});
      message.success('删除成功');

      // 如果此时表格数据只有一条数据时，删除后，需要重新获取数据
      if (userInfo.length === 1 && params.pageNo > 1) {
        dispatch(setUserParams({ ...params, pageNo: params.pageNo - 1 }));
        console.log(1)
      }
      else{
        timer = setTimeout(async () => {
            await dispatch(fetchUserInfo(params));
      }, 800)
      }
    
      


    } catch {
      message.error('删除失败');
      console.log('捕获失败');
    }
  }; 
  // 父组件控制子组件打开弹窗
  const handleData = ( rowData: UserModel | null) => {
    if(modalRef.current) modalRef.current.open(rowData);
  };
  
  // 处理弹窗逻辑实现数据获取
  const handleMessage = async (value: UserModel, type: number) => {
     console.log(value)
     if (type) {
      // 编辑
      try {
        await API.editData(value);
        message.success('编辑成功');
      } catch {
        message.error('编辑失败');
      }
    } else {
      // 新增
      try {
        await API.addData(value);
        message.success('新增成功');
      } catch {
        message.error('新增失败');
      }
    }
    setTimeout(() => {
      dispatch(fetchUserInfo(params));
   }, 800)
   
  };
  const cancel = () => {};
  const columns: TableProps<UserModel>['columns'] = [
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
      className: 'elips',
      render: (_, __, index) => {
        const currentPage = params.pageNo;
        const pageSize = params.pageSize;
        const calculatedId = (currentPage - 1) * pageSize + index + 1;
        return calculatedId;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      className: 'elips',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      className: 'elips',
      render: text => (
        <Tooltip title={text}>
          <span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'time',
      key: 'time',
      className: 'elips',
      render: text => {
        const formattedTime = dayjs(parseInt(text)).format(
          'YYYY-MM-DD HH:mm:ss'
        );
        return formattedTime;
      },
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      className: 'elips show',
      render: (_, { tags }) => (
        <Tooltip  title={tags.map(item => tagsMap[item]).join(' ')}>
          {tags.map(item => {
          const tag:string  = tagsMap[item];
           let color: string = 'blue';
          
           if(typeof tag=== 'string'){
             color = tag.length > 5 ? 'geekblue' : 'green';
           }
            return (
              <Tag color={color} key={item}>
                {tag}
              </Tag>
            );
          })}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: rowData => (
        <Space size="middle">
          <a onClick={() => handleData( rowData)}>编辑</a>
          <Popconfirm
            title="确定删除吗"
            onConfirm={() => confirm(rowData)}
            onCancel={cancel}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
 

 
  return (
    <div className="user">
      <div className="flex-box">
        <Button
          type="primary"
          className="primary"
          onClick={() => handleData(null)}
        >
          <PlusOutlined />
          添加数据
        </Button>

        <Table
          columns={columns}
          dataSource={userInfo}
          rowKey={'id'}
          bordered
          pagination={{
            total: pageInfo.total,
            pageSize: params.pageSize,
            current: params.pageNo,
            onChange: onPageChange,
            showSizeChanger: true, // 显示条目数量选择器
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'], // 可选择的每页条目数量
            showTotal: (total, range) => `共 ${total} 条数据`,
          }}
        />
        <UseModal onSuccess={handleMessage} ref ={modalRef} ></UseModal>
      </div>
    </div>
  );
};

export default List;
