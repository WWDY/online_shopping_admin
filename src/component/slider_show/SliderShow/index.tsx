import React, {ReactNode, useEffect, useState} from 'react';
import {Button, Card, Empty, Image, message, Popconfirm, Table, Tag} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import axiosInstance, {PageVO, ResultVO} from "../../../axios/axios";
import UpdateSliderShow from "../UpdateSliderShow";


const SliderShow = () => {

    const columns: ColumnsType<object> = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '缩略图',
            dataIndex: 'url',
            render: url => (
                <Image src={url} width={180}/>
            )

        },
        {
            title: '路由',
            dataIndex: 'route',
            render: (route) => (
                <Tag color={'blue'}>{route}</Tag>
            )
        },
        {
            title: '权重',
            dataIndex: 'weight',
            sorter:(a: any,b: any) => a.weight -b.weight
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            render: (value,item: any,index) => (
                <>
                    <Button size={'middle'} onClick={() => {
                        getUpdateNode(item,index)
                    }} type={'link'}>修改</Button>
                    <Popconfirm title={'确认删除?'} okText={'确认'} cancelText={'取消'} onConfirm={() => del(item.id,index)}>
                        <Button loading={loading[index]} size={'middle'} danger={true} type={'text'}>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ]


    /**
     * state
     */
    const [loading,setLoading] = useState<boolean[]>([])
    const [tableLoading,setTableLoading] = useState<boolean>(false)
    const [updateNode,setUpdateNode] = useState<ReactNode>(<></>)
    const [items, setItems] = useState<any[]>([])

    const [pageInfo,setPageInfo] = useState<PageVO>();


    /**
     * function
     */
    const getUpdateNode = (item: any, index:number) => {
        setUpdateNode(<UpdateSliderShow refreshData={refreshData} index={index} formData={item} updateNode={setUpdateNode}/>)
    }

    const refreshData = () => {
        setItems(JSON.parse(JSON.stringify(items)))
    }

    const del = (id:number,index: number) => {
        loading[index] = true
        setLoading([...loading])
        axiosInstance("/admin/slider-show/"+id,{
            method:'DELETE'
        }).then(res => {
            const resVO = res.data as ResultVO;
            loading[index] = false
            setLoading([...loading])
            if (resVO.code === 0) {
                const temp = [...items]
                temp.splice(index,1)
                if(temp.length === 0 && pageInfo!.page > 1){
                    getItems(pageInfo!.page - 1,pageInfo?.size)
                }else{
                    setItems(temp)
                }
                message.success(resVO.message).then(()=>{})
            }else {
                message.error(resVO.message).then(()=>{})
            }
        }).catch(() => {})
    }

    const getItems = async (page: number = 1, size: number = 5) => {
        setTableLoading(true)
        await axiosInstance('/admin/slider-show/', {
            method: 'GET',
            params: {
                page: page,
                size: size
            }
        }).then(res => {
            const resVO = res.data as ResultVO;
            const pageVO = resVO.data as PageVO;
            setTableLoading(false)
            setItems(pageVO.content)
            setPageInfo(pageVO)
        }).catch(() => {
        })
    };

    useEffect(() => {
        (()=>getItems())()
        return ()=>{setItems([])}
    }, [])


    return (
            <Card hoverable={true} bordered={false} style={{width: "100%", borderRadius: '10px'}}>
                <Table
                    sticky={true}
                    loading={tableLoading}
                    rowKey={'id'}
                    dataSource={items}
                    size={'middle'}
                    columns={columns}
                    locale={{emptyText: <Empty description={'暂无数据'}/>}}
                    pagination={
                    {
                        defaultCurrent:1,
                        total:pageInfo?.total,
                        current:pageInfo?.page,
                        pageSize: pageInfo?.size,
                        pageSizeOptions: [5,10,20,50],
                        onChange:(page,size) => {
                            getItems(page,size)
                        },
                        showSizeChanger:true
                    }
                }
                >
                </Table>
                {
                    updateNode
                }
            </Card>
    );
};

export default SliderShow;