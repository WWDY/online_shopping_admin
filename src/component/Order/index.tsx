import React, {useEffect, useState} from 'react';
import axiosInstance, {PageVO, ResultVO} from "../../axios/axios";
import {Button, Card, Empty, Form, Input, InputNumber, message, Modal, Popconfirm, Table, Tag} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import {DateUtil} from "../../util/DateUtil";
import {CloseOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const Order = () => {

    const [delLoading, setDelLoading] = useState<boolean[]>([])
    const [tableLoading, setTableLoading] = useState<boolean>(false)
    const [pageInfo,setPageInfo] = useState<PageVO>();
    const [items, setItems] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()


    const getItems = (page: number = 1, size: number = 5) => {
        setTableLoading(true)
        axiosInstance('/admin/order/', {
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

    const del = (id:number,index: number) => {
        delLoading[index] = true
        setDelLoading([...delLoading])
        axiosInstance("/admin/order/"+id,{
            method:'DELETE'
        }).then(res => {
            const resVO = res.data as ResultVO;
            delLoading[index] = false
            setDelLoading([...delLoading])
            if (resVO.code === 0) {
                const temps = [...items]
                temps.splice(index,1)
                if(temps.length === 0 && pageInfo!.page > 1){
                    getItems(pageInfo!.page - 1,pageInfo?.size)
                }else{
                    setItems(temps)
                }
                message.success(resVO.message).then(()=>{})
            }else {
                message.error(resVO.message).then(()=>{})
            }
        }).catch(() => {})
    }


    const handelOk = () => {
        setVisible(false)
    }

    useEffect(() => {
        getItems()
        return ()=>{setItems([])}
    }, [])

    const columns:ColumnsType<object> = [
        {
            title: '订单号',
            dataIndex: 'orderId',
        },
        {
            title: '创建时间',
            dataIndex: 'createdTime',
            render: (value: number) => {
                return DateUtil.formatDate((value * 1000),"yyyy-MM-dd HH:mm:ss")
            }
        },
        {
            title: '是否付款',
            dataIndex: 'payStatus',
            render: value => {
                return value ? <Tag color={'green'}>已付款</Tag> : <Tag color={'red'}>未付款</Tag>
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            render: (value,item: any,index) => (
                <>
                    <Button size={'middle'} onClick={() => {
                        setOrderDetail(item.snapshots)
                        setVisible(true)
                    }} type={'link'}>详情</Button>
                    <Popconfirm title={'确认删除?'} okText={'确认'} cancelText={'取消'} onConfirm={() => del(item.orderId,index)}>
                        <Button loading={delLoading[index]} size={'middle'} danger={true} type={'text'}>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    const [orderDetail,setOrderDetail] = useState<any[]>()

    const detailColumns:ColumnsType<object> = [
        {
            title: '商品ID',
            dataIndex: 'shopId',
        },
        {
            title: '商品名称',
            dataIndex: 'shopTitle',
        },
        {
            title: '商品原价',
            dataIndex: 'shopPrice',
        },
        {
            title: '商品折扣价',
            dataIndex: 'shopDiscountPrice',
        },
        {
            title: '商品数量',
            dataIndex: 'shopCount',
        },
    ]

    return (
        <Card hoverable={true} style={{borderRadius:10}}>
            <Table
                rowKey={"id"}
                loading={tableLoading}
                size={'middle'}
                columns={columns}
                dataSource={items}
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

            <Modal
                closeIcon={<CloseOutlined/>}
                title="订单详情"
                cancelText={'取消'}
                visible={visible}
                okText={'确定'}
                onOk={handelOk}
                style={{borderRadius: '10px', textAlign: 'left'}}
                onCancel={() => {
                    setVisible(false)
                    form.resetFields();
                }}
            >
                <Table
                    pagination={false}
                    rowKey={"id"}
                    size={'middle'}
                    columns={detailColumns}
                    dataSource={orderDetail}
                    locale={{emptyText: <Empty description={'暂无数据'}/>}}
                >
                </Table>
            </Modal>
        </Card>
    );
};

export default Order;