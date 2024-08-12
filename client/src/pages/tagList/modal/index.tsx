import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';

import { Modal, Form, Input} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ModalInstance } from '../../../store/type/modal';
import { UserTags } from '../../../store/type/type';
interface UserModalProps {
  onSuccess: (message: UserTags, type: number) => void
}
const UserModal = forwardRef<ModalInstance, UserModalProps>(function UserModal({onSuccess}, ref) {
  // 判定弹窗是否打开
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const [form] = useForm();
  const [value, setValue] = useState('');

  const open = (value: UserTags | null) => {
    if(!value) setModalType(0)
    else {
        setModalType(1)
        // 数据填写到表格中
        const cloneData: UserTags = JSON.parse(JSON.stringify(value));
        form.setFieldsValue(cloneData);
    }
    // 打开弹窗
    setModalOpen(true);
  }
  const handleOk = async () => {
    const values = await form.validateFields();
    // console.log('values', values);
    onSuccess(values, modalType);
    handleCancel();
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 11) {
      setValue(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (value.length >= 11 && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };
  // 向外暴露的方法
  useImperativeHandle(ref, () => ({
    open,
  }));
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
            { required: true, message: '内容不能为空' },
            { max: 10, message: '最大长度不能超过10' },
          ]}
        >
          <Input
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            suffix={`${value.length} / 10`}
            placeholder="请输入名称"
          />
        </Form.Item>
      </Form>
    </Modal>
    </div>
  );
});

export default UserModal;
