import React, {lazy, ReactElement, ReactNode, Suspense} from "react";
import {useRouteGuard} from "./hook";


import Home from "../component/Home";
import {CustomerRouteObject} from "./useRoutes";
import Login from "../component/Login";
import {LOGIN_GET_TOKEN, LOGIN_URL, SESSION_STORAGE_CURRENT_ROUTE_KEY, SESSION_STORAGE_TOKEN_KEY} from "../constant";
import Container from "../page/Container";
import {Skeleton} from "antd";
const AddSliderShow = lazy(() => import("../component/slider_show/AddSliderShow"))
const Shop = lazy(() => import("../component/shopping/Shop"))
const SliderShow = lazy(() => import("../component/slider_show/SliderShow"))
const SPU = lazy(() => import("../component/shopping/SPU"))
const AddShop = lazy(() => import("../component/shopping/AddShop"))
const CateGoryAdd = lazy(() => import("../component/category/CategoryAdd"))
const AddNotice = lazy(() => import("../component/AddNotice"))
const Notice = lazy(() => import("../component/Notice"))
const Page401 = lazy(() => import("../component/401"))
const User = lazy(() => import("../component/User"))
const Order = lazy(() => import("../component/Order"))

export const lazyLoad = (node: ReactNode): ReactElement => {
    return (
        <Suspense fallback={<Skeleton active />}>
            {node}
        </Suspense>
    )
}

const routes: CustomerRouteObject[] = [
    {
        path: '/',
        element: <Container/>,
        meta:{
            title:'后台管理',
            auth: false
        },
        children: [
            {
                path: '/home',
                element: <Home/>,
                meta:{
                    title:'Home',
                    auth: true
                }
            },
            {
                path: '/slider',
                element: lazyLoad(<SliderShow/>),
                meta:{
                    title:'轮播图管理',
                    auth: true
                }
            },
            {
                path: '/slider/add',
                element: lazyLoad(<AddSliderShow/>),
                meta:{
                    title:'添加轮播图',
                    auth: true
                }
            },
            {
                path:'/shop',
                element: lazyLoad(<Shop/>),
                meta: {
                    title: '商品列表',
                    auth: true
                }
            },
            {
                path:'/shop/add',
                element: lazyLoad(<AddShop/>),
                meta: {
                    title: '添加商品',
                    auth: true
                }
            },
            {
                path:'/shop/spu',
                element: lazyLoad(<SPU/>),
                meta: {
                    title: 'SUP列表',
                    auth: true
                }
            },
            {
                path:'/shop/category',
                element: lazyLoad(<CateGoryAdd/>),
                meta: {
                    title: '分类管理',
                    auth: true
                }
            },
            {
                path:'/notice',
                element: lazyLoad(<Notice/>),
                meta: {
                    title: '公告管理',
                    auth: true
                }
            },
            {
                path:'/notice/add',
                element: lazyLoad(<AddNotice/>),
                meta: {
                    title: '公告管理',
                    auth: true
                }
            },
            {
                path:'/user',
                element: lazyLoad(<User/>),
                meta: {
                    title: '用户管理',
                    auth: true
                }
            },
            {
                path:'/order',
                element: lazyLoad(<Order/>),
                meta: {
                    title: '订单管理',
                    auth: true
                }
            },
            {
                path:'/401',
                element: lazyLoad(<Page401/>),
                meta: {
                    title: '暂无操作权限',
                    auth: false
                }
            },

        ]
    },
    {
        path: '/login',
        element: <Login/>,
        meta:{
            title:'登录',
            auth: false
        }
    }
]

useRouteGuard((data: CustomerRouteObject): ReactElement => {

    const {meta, element} = data

    if (meta?.auth) {
        if(!sessionStorage.getItem(SESSION_STORAGE_TOKEN_KEY)){
            sessionStorage.setItem(SESSION_STORAGE_CURRENT_ROUTE_KEY,data.path!)
            window.location.replace(encodeURI(LOGIN_URL + LOGIN_GET_TOKEN))
            return <></>
        }else{
            return element
        }
    }else{
        return element
    }

})

export default routes
