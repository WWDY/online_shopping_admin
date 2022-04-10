import {Route, RouteObject, Routes} from "react-router-dom";
import * as React from "react";
import {ReactElement} from "react";
import {routeWilDid} from "./hook"
import {lazyLoad} from "./index";

export type RouteMeta = {
    title?: string | undefined,
    auth?: boolean | undefined
}

export interface CustomerRouteObject extends RouteObject {
    meta?: RouteMeta,
    element: ReactElement,
    children?: CustomerRouteObject[]
}

type Props = {
    data: CustomerRouteObject
};

const Guard = (props: Props) => {
    if (props.data.meta?.title) {
        document.title = props.data.meta?.title
    }
    return lazyLoad(routeWilDid()(props.data))
}

const useRoutes = (routes: CustomerRouteObject[]): ReactElement => {
    return (
        <Routes>
            {
                routes.map((route, index) => {
                    return (
                        <Route caseSensitive={route.caseSensitive} key={index} path={route.path}
                               element={<Guard data={route}/>}>
                            {traverseChildrenRoute(route.children, String(index))}
                        </Route>
                    )
                })
            }
        </Routes>
    )
}

const traverseChildrenRoute = (childrenRoutes: CustomerRouteObject[] | undefined, parentIndex: string): ReactElement => {
    if (childrenRoutes && childrenRoutes.length > 0) {
        return (
            <>
                {
                    childrenRoutes.map((route, index) => {
                        let currentIndex = parentIndex + "-" + index
                        return (
                            <Route key={currentIndex} path={route.path} element={<Guard data={route}/>}
                                   index={route.index}>
                                {traverseChildrenRoute(route.children, currentIndex)}
                            </Route>
                        )
                    })
                }
            </>
        )

    } else {
        return (
            <></>
        )
    }

}

export default useRoutes
