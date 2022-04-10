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
            title: '公告内容',
            dataIndex: 'content',
            ellipsis: true,
        },
        {
            title: '权重',
            dataIndex: 'weight'
        },
        {
            title: '创建时间',
            dataIndex: 'createdTime',
            render: value => {
                return DateUtil.formatDate(value * 1000, 'yyyy-MM-dd HH:mm:ss')
            }
        },
        {
            title: '更新时间',
            dataIndex: 'updatedTime',
            render: (value: number) => {
                console.log(value)
                console.log(Date.now()+'============')
                return DateUtil.formatDate(value * 1000, 'yyyy-MM-dd HH:mm:ss')
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            render: (value,item: any,index) => (
                <>
                    <Button size={'middle'} onClick={() => {
                        form.setFieldsValue(item)
                        setVisible(true)
                    }} type={'link'}>修改</Button>
                    <Popconfirm title={'确认删除?'} okText={'确认'} cancelText={'取消'} onConfirm={() => del(item.id,index)}>
                        <Button loading={delLoading[index]} size={'middle'} danger={true} type={'text'}>删除</Button>
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
                title="通知公告"
                cancelText={'取消'}
                visible={visible}
                okText={'提交'}
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
                        label={'公告内容'}
                        rules={[{required: true, message: '请输入公告内容'}]}
                    >
                        <TextArea/>
                    </Form.Item>
                    <Form.Item
                        name={'weight'}
                        label={'权重'}
                    >
                        <InputNumber min={0}/>
                    </Form.Item>
                </Form>
            </Modal>

        </Card>
    );
};

export default Notice;