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
            title: '?????????',
            dataIndex: 'orderId',
        },
        {
            title: '????????????',
            dataIndex: 'createdTime',
            render: (value: number) => {
                return DateUtil.formatDate((value * 1000),"yyyy-MM-dd HH:mm:ss")
            }
        },
        {
            title: '????????????',
            dataIndex: 'payStatus',
            render: value => {
                return value ? <Tag color={'green'}>?????????</Tag> : <Tag color={'red'}>?????????</Tag>
            }
        },
        {
            title: '??????',
            dataIndex: 'action',
            fixed: 'right',
            render: (value,item: any,index) => (
                <>
                    <Button size={'middle'} onClick={() => {
                        setOrderDetail(item.snapshots)
                        setVisible(true)
                    }} type={'link'}>??????</Button>
                    <Popconfirm title={'?????????????'} okText={'??????'} cancelText={'??????'} onConfirm={() => del(item.orderId,index)}>
                        <Button loading={delLoading[index]} size={'middle'} danger={true} type={'text'}>??????</Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    const [orderDetail,setOrderDetail] = useState<any[]>()

    const detailColumns:ColumnsType<object> = [
        {
            title: '??????ID',
            dataIndex: 'shopId',
        },
        {
            title: '????????????',
            dataIndex: 'shopTitle',
        },
        {
            title: '????????????',
            dataIndex: 'shopPrice',
        },
        {
            title: '???????????????',
            dataIndex: 'shopDiscountPrice',
        },
        {
            title: '????????????',
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
                locale={{emptyText: <Empty description={'????????????'}/>}}
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
                title="????????????"
                cancelText={'??????'}
                visible={visible}
                okText={'??????'}
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
                    locale={{emptyText: <Empty description={'????????????'}/>}}
                >
                </Table>
            </Modal>
        </Card>
    );
};

export default Order;