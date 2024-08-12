import React, {useState, forwardRef,useImperativeHandle, useRef, ChangeEvent,KeyboardEvent } from 'react';
import { Form, Input, Select, Modal } from 'antd';
import {useAppSelector} from '../../../store';
import { useForm } from 'antd/es/form/Form';
import { UserModel, UserTags } from '../../../store/type/type';
import { ModalInstance } from '../../../store/type/modal';
const { Option } = Select;
interface UserModalProps {
   onSuccess: (message:UserModel, type: number) => void
}
const UseModal =forwardRef<ModalInstance, UserModalProps>(function UseModal({onSuccess}, ref) {

  // 控制弹窗的显示和隐藏
  const [isModalOpen, setModalOpen] = useState(false);
  // 控制弹窗是修改(1) 还是新增(0)
  const [modalType, setModalType] = useState(0);
 // 打开弹窗的方法
 const modalRef = useRef<HTMLDivElement>(null);
 const [form] = useForm<UserModel>();
 const open = (value: UserModel| null) => {
  if(!value) setModalType(0)
  else {
      setModalType(1)
      // 数据填写到表格中
      const cloneData: UserModel = JSON.parse(JSON.stringify(value));
      form.setFieldsValue(cloneData);
  }
  setModalOpen(true)
 }
useImperativeHandle(ref, () => {
    return {
      open
    }
});

  const { tagList} = useAppSelector(state => state.user);

  
  const [value, setValue] = useState('');
  const handleOk = async () => {
    const value = await form.validateFields();
    console.log(value);
    onSuccess(value, modalType);
    handleCancel()
  };
  const handleCancel = () => {
    // console.log('1111111111');
    setModalOpen(false);
    form.resetFields();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 21) {
      setValue(e.target.value);
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (value.length >= 21 && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };
  return (
    <div ref={modalRef}>
      <Modal
        open={isModalOpen}
        title={modalType ? '编辑记录' : '新增记录'}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          {modalType === 1 && (
            <Form.Item name={'id'} hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="名称"
            rules={[
              { required: true },
              { max: 20, message: '最大长度不能超过20' },
            ]}
          >
            <Input
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              suffix={`${value.length} / 20`}
              placeholder="请输入名称"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: 'Please input Intro' }]}
          >
            <Input.TextArea
              showCount
              maxLength={50}
              placeholder="请输入描述"
              style={{ resize: 'none' }}
            />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="multiple" placeholder="请输入标签">
              {tagList.map((item: UserTags) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});
export default UseModal;
