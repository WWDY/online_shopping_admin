import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {Button, Card, Image, message, Modal, Popconfirm, Table, Tag} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import axiosInstance, {PageVO, ResultVO} from "../../../axios/axios";
import {SpuStatus} from "../SPU";
import UpdateShop from "../UpdateShop";
import {MacScrollbar} from "mac-scrollbar";

const Shop = () => {

    /**
     * state
     */
    const [loading,setLoading] = useState<boolean[]>([])
    const [tableLoading,setTableLoading] = useState<boolean>(false)
    const [pageInfo,setPageInfo] = useState<PageVO>();
    const [items, setItems] = useState<any[]>([])
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [updateElement, setUpdateElement] = useState<ReactNode>(<></>)

    /**
     * constant
     */
    const columns:ColumnsType<object> = [
        {
            title: '商品标题',
            dataIndex: 'title',
        },
        {
            title: '缩略图',
            dataIndex: 'sliderShow',
            render: (url:string[]) => (
                <Image src={url[0]} width={180}/>
            )

        },
        {
            title: '库存',
            dataIndex: 'stock',
            render: (value) => {
                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (value) => {
                if(value === 'SHELVES'){
                    return <Tag color={'green'}>{SpuStatus.SHELVES}</Tag>
                }else if(value === 'NO_SHELVES'){
                    return <Tag color={'red'}>{SpuStatus.NO_SHELVES}</Tag>
                }else{
                    return value;
                }
            }
        },
        {
            title: '销售价',
            dataIndex: 'discountPrice',
            render: (value) => {
                return `￥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
        },
        {
            title: '销售量',
            dataIndex: 'sales',
            sorter:(a: any,b: any) => a.sales -b.sales,
            render: (value) => {
                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            render: (value,item: any,index) => (
                <>
                    <Button size={'middle'} onClick={() => {
                        getUpdateNode(item)
                    }} type={'link'}>修改</Button>
                    <Popconfirm title={'确认删除?'} okText={'确认'} cancelText={'取消'} onConfirm={() => del(item.id,index)}>
                        <Button loading={loading[index]} size={'middle'} danger={true} type={'text'}>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    /**
     * function
     */
    const getItems = (page: number = 1, size: number = 5) => {
        setTableLoading(true)
        axiosInstance('/admin/shop/', {
            method: 'GET',
            params: {
                page: page,
                size: size
            }
        }).then(res => {
            const resVO = res.data as ResultVO;
            const pageVO = resVO.data as PageVO;
            setTableLoading(false)
            setItems(JSON.parse(JSON.stringify(pageVO.content)))
            setPageInfo(pageVO)
        }).catch(() => {
        })
    };

    const getUpdateNode = (item: any) => {
        setModalVisible(true)
        setUpdateElement(<UpdateShop getUpdateData={(data: any) => {
            const index = items.findIndex(item => data.id === item.id);
            const sales = items[index].sales
            items[index] = data
            items[index].sales = sales
            setItems(JSON.parse(JSON.stringify(items)))

        }} ref={updateNodeRef} data={item}/>)
    }

    const del = (id:number,index: number) => {
        loading[index] = true
        setLoading([...loading])
        axiosInstance("/admin/shop/"+id,{
            method:'DELETE'
        }).then(res => {
            const resVO = res.data as ResultVO;
            loading[index] = false
            setLoading([...loading])
            if (resVO.code === 0) {
                const temp = [...items]
                temp.splice(index,1)
                if(temp.length === 0 && pageInfo!.page > 1){
                    getItems(pageInfo!.page - 1, pageInfo?.size)
                }else{
                    setItems(temp)
                }
                message.success(resVO.message).then(()=>{})
            }else {
                message.error(resVO.message).then(()=>{})
            }
        }).catch(() => {})
    }

    /**
     * hook
     */
    useEffect(() => {
        (()=>getItems())()
        return ()=>{setItems([])}
    }, [])

    const updateNodeRef = useRef();

    return (
        <Card style={{borderRadius:10}} hoverable={true}>
            <Table
                sticky={true}
                loading={tableLoading}
                rowKey={'id'}
                dataSource={items}
                size={'middle'}
                columns={columns}
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
            />
            <MacScrollbar>
                <Modal
                    onCancel={() => {setModalVisible(false);setUpdateElement(<></>)} }
                    width={800}
                    visible={modalVisible}
                    okText={'确认'}
                    cancelText={'取消'}
                    onOk={() => {
                        // @ts-ignore
                        updateNodeRef.current?.finish()
                        setUpdateElement(<></>)
                        setModalVisible(false)
                    }}
                >
                    {
                        updateElement
                    }
                </Modal>
            </MacScrollbar>

        </Card>
    );
};

export default Shop;