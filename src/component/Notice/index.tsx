import React, {useEffect, useState} from 'react';
import {Button, Card, Empty, Form, Input, InputNumber, message, Modal, Popconfirm, Table} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import axiosInstance, {PageVO, ResultVO} from "../../axios/axios";
import {DateUtil} from "../../util/DateUtil";
import {CloseOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const Notice = () => {

    const [delLoading, setDelLoading] = useState<boolean[]>([])
    const [tableLoading, setTableLoading] = useState<boolean>(false)
    const [pageInfo,setPageInfo] = useState<PageVO>();
    const [items, setItems] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()


    const getItems = (page: number = 1, size: number = 5) => {
        setTableLoading(true)
        axiosInstance('/admin/notice/', {
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
        axiosInstance("/admin/notice/"+id,{
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

    const update = (value: any) => {
        axiosInstance('/admin/notice/',{
            method: 'PATCH',
            data: JSON.stringify(value)
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                setVisible(false)
                getItems()
                message.success(resVO.message).then()
            }else {
                message.error(resVO.message).then()
            }
        }).catch()
    }

    const handelOk = () => {
        form.validateFields().then(() => {
            setLoading(true)
            form.submit()
        }).catch(() => {})
    }

    useEffect(() => {
        getItems()
        return ()=>{setItems([])}
    }, [])

    const columns:ColumnsType<object> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '????????????',
            dataIndex: 'content',
            ellipsis: true,
        },
        {
            title: '??????',
            dataIndex: 'weight'
        },
        {
            title: '????????????',
            dataIndex: 'createdTime',
            render: value => {
                return DateUtil.formatDate(value * 1000, 'yyyy-MM-dd HH:mm:ss')
            }
        },
        {
            title: '????????????',
            dataIndex: 'updatedTime',
            render: (value: number) => {
                console.log(value)
                console.log(Date.now()+'============')
                return DateUtil.formatDate(value * 1000, 'yyyy-MM-dd HH:mm:ss')
            }
        },
        {
            title: '??????',
            dataIndex: 'action',
            fixed: 'right',
            render: (value,item: any,index) => (
                <>
                    <Button size={'middle'} onClick={() => {
                        form.setFieldsValue(item)
                        setVisible(true)
                    }} type={'link'}>??????</Button>
                    <Popconfirm title={'?????????????'} okText={'??????'} cancelText={'??????'} onConfirm={() => del(item.id,index)}>
                        <Button loading={delLoading[index]} size={'middle'} danger={true} type={'text'}>??????</Button>
                    </Popconfirm>
                </>
            )
        }
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
                okButtonProps={{loading}}
                onOk={handelOk}
                style={{borderRadius: '10px', textAlign: 'left'}}
                onCancel={() => {
                    setVisible(false)
                    form.resetFields();
                }}
            >
                <Form form={form} labelCol={{span:5}} onFinish={update}>
                    <Form.Item
                        name={'id'}
                        label={'id'}
                        hidden={true}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name={'content'}
                        label={'????????????'}
                        rules={[{required: true, message: '?????????????????????'}]}
                    >
                        <TextArea/>
                    </Form.Item>
                    <Form.Item
                        name={'weight'}
                        label={'??????'}
                    >
                        <InputNumber min={0}/>
                    </Form.Item>
                </Form>
            </Modal>

        </Card>
    );
};

export default Notice;