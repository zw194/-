import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import React, { ChangeEvent,KeyboardEvent, memo, useEffect, useState } from 'react';
import { fetchUserInfo, setUserParams } from '../../store/modules/user';
import { useAppDispatch, useAppSelector } from '../../store';
import { UserParams } from '../../store/type/type';
import dayjs from 'dayjs';
import './index.css';
const { RangePicker } = DatePicker;
const { Option } = Select;

const Search: React.FC = memo(function Search() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<UserParams>({
    name: '', tags: [], startTime: '', endTime: '', pageNo: 1,
  pageSize: 5,
 });
 // 使用useEffect获取数据
 useEffect(() => {
  dispatch(fetchUserInfo({ ...result }))
  dispatch(setUserParams({ ...result }));
}, [result])
  const dispatch = useAppDispatch();
  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 21) {
      setValue(e.target.value);
    }
  };
  const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
    if (value.length >= 21 && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  interface formData {
    name: string;
    tags: string[];
    date: [dayjs.Dayjs, dayjs.Dayjs];
  }
  // 获取表单数据
  const onfinish = (values: formData) => {
    console.log('value', values);
    let name = '';
    if (values.name !== undefined && values.name !== null) name = values.name;
    let tags:string[] = [];
    if (values.tags !== undefined && values.tags !== null) tags = values.tags;

    let startTime = '';
    let endTime = '';
    if (values.date !== undefined && values.date !== null) {
      startTime = dayjs(values.date[0]).format('YYYY-MM-DD HH:mm:ss');
      endTime = dayjs(values.date[1]).format('YYYY-MM-DD HH:mm:ss');
    }
   
    console.log(name)
    // 更新搜索结果
    setResult({ ...result, name, tags, startTime, endTime, pageNo: 1 });
  };

  // 表单数据清空

  const onReset = () => {
    // 重置表单数据
    setValue('');
    setResult({ ...result, name: '', tags: [], startTime: '', endTime: '', pageNo: 1 })
  }
  const { tagList } = useAppSelector(state => state.user);
  return (
    <Form onFinish={onfinish} validateTrigger={['onBlur']}>
      <Form.Item
        label="名称"
        name="name"
        rules={[{ max: 20, message: '最大长度不能超过20' }]}
        style={{
          display: 'inline-block',
          minWidth: '230px',
          marginRight: '10px',
        }}
      >
        <Input
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          suffix={`${value.length} / 20`}
          placeholder="请输入搜素名称"
          style={{ maxWidth: '360px' }}
        />
      </Form.Item>

      <Form.Item
        label="标签"
        name="tags"
        style={{
          display: 'inline-block',
          marginRight: '10px',
          minWidth: '200px',
          maxWidth: '200px',
          // disp:'hidden'
        }}
      >
        <Select mode="multiple" placeholder="请输入标签">
          {tagList.map((item: any) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="添加时间"
        style={{ display: 'inline-block' }}
      >
        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ maxWidth: '360px' }}
        />
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 6, span: 16 }}
        style={{ display: 'inline-block', marginLeft: '-20px' }}
      >
        <Space>
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            onClick={onReset}
            icon={<RedoOutlined />}
            htmlType='reset'
          >
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
);
export default Search;
