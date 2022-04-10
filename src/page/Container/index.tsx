import React, {useEffect, useState} from 'react';
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    InboxOutlined,
    ShoppingOutlined,
    BellOutlined,
    SlidersOutlined,
    PictureOutlined,
    UnorderedListOutlined,
    ShopOutlined,
    ContainerOutlined,
    PartitionOutlined,
    FileAddOutlined,
    UserOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import styles from './index.module.less'
import {Avatar, Dropdown, Layout, Menu, message} from "antd";
import {Footer} from "antd/es/layout/layout";
import axiosInstance, {ResultVO} from "../../axios/axios";
import {SESSION_STORAGE_TOKEN_KEY} from "../../constant";

const {Header, Sider, Content} = Layout;


const Container = () => {

    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [username, setUsername] = React.useState('');

    const location = useLocation();

    const navigate = useNavigate();

    const toggle = () => {
        !collapsed ? setRightWidth(80) : setRightWidth(200)
        setCollapsed(!collapsed)
    }

    const [rightWidth, setRightWidth] = useState<number>(200);

    const logout = () => {
        axiosInstance('/auth/login/logout', {
            method: 'GET',
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                localStorage.removeItem(SESSION_STORAGE_TOKEN_KEY);
                setUsername('')
                navigate('/')
                message.success(resVO.message).then()
            }else{
                message.error(resVO.message).then()
            }
        }).catch()
    }

    const getUserInfo = () => {
        axiosInstance('/front/user/info', {
            method: 'GET',
            params: {
                token: sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY)
            }
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                setUsername(resVO.data.username);
            }
        }).catch()
    }

    useEffect(() => {
        if (sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY)) {
            getUserInfo();
        }
    }, [])

    const menu = <Menu style={{borderRadius: 5}}>
        <Menu.Item key={1} onClick={() => {logout()}}>
            <span><LogoutOutlined/> &nbsp;注销登录</span>
        </Menu.Item>
    </Menu>

    const login = <>
        <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Avatar style={{verticalAlign: 'middle', backgroundColor: '#7367f0'}} size="large">
                    {username.length >= 3 ? username.substring(0, 1) : username}
                </Avatar>
            </a>
        </Dropdown>
    </>

    return (
        <Layout style={{minHeight: '100%'}}>
            <Sider
                style={
                    {
                        background: 'rgba(255, 255, 255)',
                        maxHeight: '100vh',
                        position: "fixed",
                        overflow: 'auto',
                        height: '100vh',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }
                }
                onCollapse={(collapsed) => {
                    collapsed ? setRightWidth(80) : setRightWidth(200)
                    setCollapsed(collapsed)
                }}

                collapsed={collapsed}
                breakpoint="md"
            >
                <div className={styles.logo}/>
                <Menu theme="light" mode="inline" defaultOpenKeys={[location.pathname.split("/")[1]]}
                      defaultSelectedKeys={[location.pathname]}>
                    <Menu.SubMenu key={'slider'} icon={<SlidersOutlined/>} title={'轮播图管理'}>
                        <Menu.Item key={'/slider'} icon={<UnorderedListOutlined/>}>
                            <Link to={'/slider'}>轮播图列表</Link>
                        </Menu.Item>
                        <Menu.Item key={'/slider/add'} icon={<PictureOutlined/>}>
                            <Link to={'/slider/add'}>新增轮播图</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="shop" icon={<ShoppingOutlined/>} title={'商品系统'}>
                        <Menu.Item key={'/shop'} icon={<UnorderedListOutlined/>}>
                            <Link to={'/shop'}>商品列表</Link>
                        </Menu.Item>
                        <Menu.Item key={'/shop/add'} icon={<ShopOutlined/>}>
                            <Link to={'/shop/add'}>添加商品</Link>
                        </Menu.Item>
                        <Menu.Item key={'/shop/spu'} icon={<ContainerOutlined/>}>
                            <Link to={'/shop/spu'}>SPU</Link>
                        </Menu.Item>
                        <Menu.Item key={'/shop/category'} icon={<PartitionOutlined/>}>
                            <Link to={'/shop/category'}>分类管理</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key={"notice"} icon={<BellOutlined />} title={'公告系统'}>
                        <Menu.Item key={'/notice'} icon={<InboxOutlined />}>
                            <Link to={'/notice'}>公告管理</Link>
                        </Menu.Item>
                        <Menu.Item key={'/notice/add'} icon={<FileAddOutlined/>}>
                            <Link to={'/notice/add'}>添加公告</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="order" icon={<InboxOutlined/>} title={'订单系统'}>
                        <Menu.Item key={'/order'} icon={<FileAddOutlined/>}>
                            <Link to={'/order'}>订单管理</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="user" icon={<UserOutlined />} title={'用户系统'}>
                        <Menu.Item key={'/user'} icon={<UserOutlined />}>
                            <Link to={'/user'}>用户管理</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Sider>
            <Layout className={styles.siteLayout} style={{'marginLeft': rightWidth, transition: 'margin-left .2s'}}>
                <Header className={styles.siteLayoutBackground}
                        style={{padding: '0 14px', margin: 14, borderRadius: 10}}>
                    {
                        React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: styles.trigger,
                        onClick: toggle,
                        })
                    }
                    <span style={{float:'right',marginRight:60}}>
                        {
                            login
                        }
                    </span>

                </Header>
                <Content
                    style={{
                        overflow: 'initial',
                        margin: '10px 16px',
                        minHeight: 280,
                        borderRadius: '10px',
                        maxHeight: '3600px'
                    }}
                >
                    <Outlet/>
                </Content>
                <Footer style={{textAlign: 'center'}}>Copyright &copy;2022 Created by WWDY</Footer>
            </Layout>
        </Layout>
    );

};

export default Container;