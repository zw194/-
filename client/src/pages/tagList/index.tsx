import React, {useEffect, useRef, useState } from 'react';
import { Space, Button, Table, Tag, Popconfirm, message } from 'antd';
import './index.css';
import type { TableProps } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { UserTags } from '../../store/type/type';
import { fetchTags } from '../../store/modules/user';
import UserModal from './modal/index';
import { ModalInstance } from '../../store/type/modal';
import API from '../../utils/index';
const ListShow = () => {
  const dispatch = useAppDispatch();
  const { tagList } = useAppSelector(state => state.user);
  const modalRef = useRef<ModalInstance>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  // 复选框多次数据选择
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 表格数据
  const columns: TableProps<UserTags>['columns'] = [
    {
      title: '标签',
      key: 'name',
      dataIndex: 'name',
      render: (_, record: UserTags) => {
        let color = record.name.length >= 5 ? 'geekblue' : 'green';
        if (record.name.length > 7) {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={record.name}>
            {record.name}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: rowData => (
        <Space size="middle">
          <a onClick={() => handleData(rowData)}>编辑</a>
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
  // 打开弹窗实现逻辑
  const handleData = (rowData: UserTags | null) => {
    modalRef.current?.open(rowData)
  };
  // 处理弹窗实现获取数据的请求
  const handleMessage = async (value: UserTags, type: number) => {
      if (type) {
        // Edit
        try {
          await API.editTag(value);
          message.success('编辑成功');
        } catch (error) {
          message.error('编辑失败');
        }
      } else {
        // Add
        try {
          await API.addTag(value);
          message.success('添加成功');
        } catch (error) {
          message.error('添加失败');
        }
      }
       setTimeout(() => {
        dispatch(fetchTags());
     }, 800)
  };
  // 删除标签的逻辑
  const confirm = async (rowData: UserTags) => {
    try {
      await API.delTag({ id: [rowData.id] });
      setTimeout(async () => {
        await dispatch(fetchTags());
      }, 800); 
      message.success('删除成功');
    } catch (error) {
      console.log('捕获异常');
      message.error('删除失败');
    }
  };
   // 批量删除数据
   const delData = async () => {
    try {
      const result: string[] = selectedRowKeys.map(item => item.toString());
      await API.delTag({ id: result });
      setTimeout(async () => {
        await dispatch(fetchTags());
      }, 800);
      message.success('批量删除成功');
    } catch {
      console.log('异常');
    }
  };

  const cancel = () => {};
  return (
    <div className="user">
      <div className="flex-box">
       
        <div style={{ float: 'right', marginBottom: '20px' }}>
          <Button type="primary" onClick={() => handleData(null)}>
            <PlusOutlined />
            添加数据
          </Button>
          <Button
            disabled={!selectedRowKeys || selectedRowKeys.length === 0}
            className={
              !selectedRowKeys || selectedRowKeys.length === 0
                ? 'disabled-button'
                : ''
            }
            onClick={delData}
            style={{
              backgroundColor: 'red',
              color: '#fff',
              marginLeft: '10px',
            }}
          >
            <MinusOutlined />
            确定删除
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tagList}
          rowKey={'id'}
          bordered
          rowSelection={rowSelection}
          pagination={{
            total: tagList.length,
            pageSize: 7,
            showTotal: (total, range) => `共 ${total} 条数据`,
          }}
        />
        <UserModal onSuccess={handleMessage} ref = {modalRef} />
      </div>
    </div>
  );
};

export default ListShow;
