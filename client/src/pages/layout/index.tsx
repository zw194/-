import React, { useEffect, useState } from 'react';
import {
  BarChartOutlined,
  TagsOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ConfigProvider, Layout, Menu, theme, Space, Switch } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './index.css';
// import request from '../../utils/request';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import API from '../../utils';

import 'dayjs/locale/zh-cn';

dayjs.locale('en');

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode
): MenuItem {
  return {
    key,
    icon,
    label,
  } as MenuItem;
}
const geekLayout = () => {
  const [locale, setLocale] = useState('en');
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items: MenuItem[] = [
  getItem(locale === 'en' ? 'dataManage': '数据管理', '/', <BarChartOutlined />),
  getItem(locale === 'en' ? 'labelManage': '标签管理', '/label', <TagsOutlined />),
];
  // 实现路由跳转
  const onMenuClick = (route: { key: string }) => {
    navigate(route.key);
  };
  useEffect(() => {
    // request('api/lang', 'get').then((response: any) =>
    //   setLocale(response.data.data)
    // );
    API.getLang().then((response) => setLocale(response.data.data));
  }, []);
  // 得到当前路由路径
  const location = useLocation();
  const selectKey = location.pathname;

  const handleChange = async (checked: boolean) => {
    const lang = checked ? 'zh' : 'en';
    await API.setLang({ lang });
    setLocale(lang);
  };
  // 切换框的显示和隐藏
  const [toggleVisible, setToggleVisible] = useState(false); // 初始状态为隐藏
  const handleSettingsClick = () => {
    setToggleVisible(!toggleVisible); // 点击设置按钮时切换显示状态
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <div className="content">{locale === 'en' ? 'contentManageSystem':'内容管理平台'}</div>
        <Menu
          theme="dark"
          selectedKeys={[selectKey]}
          onClick={onMenuClick}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#001629' }}>
          <div className="set">
            <div onClick={handleSettingsClick}>
              <SettingOutlined
                style={{ color: '#fff', paddingRight: '20px' }}
              />
              <span>设置</span>
            </div>

            <Space direction="vertical">
              <Switch
                checkedChildren={locale === 'en' ?'英文' : '中文'}
                unCheckedChildren={locale === 'en' ? '英文':'中文'}
                onChange={handleChange}
                className={toggleVisible ? 'toggle visible' : 'toggle'}
              />
            </Space>
          </div>
        </Header>
        <Content>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
            }}
          >
            <ConfigProvider locale={locale === 'zh' ? zhCN : enUS}>
              <Outlet></Outlet>
            </ConfigProvider>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default geekLayout;
