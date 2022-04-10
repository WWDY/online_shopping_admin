import useRoutes from "./router/useRoutes";
import './App.less'
import routes from "./router";
import {ConfigProvider} from "antd";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import {GlobalScrollbar} from "mac-scrollbar";
import 'mac-scrollbar/dist/mac-scrollbar.css';

function App() {

    return (
        <ConfigProvider locale={zh_CN}>
            <GlobalScrollbar/>
            <div className="App">
                {
                    useRoutes(routes)
                }
            </div>
        </ConfigProvider>
    )
}

export default App
