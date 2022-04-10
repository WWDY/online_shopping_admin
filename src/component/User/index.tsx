import React, {useEffect, useState} from 'react';
import {Button, Card, Empty, Form, Input, message, Modal, Switch, Table, Tag} from "antd";
import axiosInstance, {PageVO, ResultVO} from "../../axios/axios";
import {ColumnsType} from "antd/lib/table/interface";
import {CloseOutlined} from "@ant-design/icons";

const User = () => {

    const [tableLoading, setTableLoading] = useState<boolean>(false)
    const [pageInfo, setPageInfo] = useState<PageVO>();
    const [items, setItems] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] =  Form.useForm();

    const columns: ColumnsType<object> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '账号',
            dataIndex: 'username',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
        },
        {
            title: '管理员',
            dataIndex: 'adminRole',
            render: value => {
                return value ? <Tag color={'green'}>是</Tag> : <Tag color={'red'}>否</Tag>
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
                </>
            )
        }
    ]

    const update = (value: any) => {
        axiosInstance('/admin/user/',{
            method: 'PUT',
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


    const getItems = (page: number = 1, size: number = 5) => {
        setTableLoading(true)
        axiosInstance('/admin/user/', {
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
        getItems()
        return ()=>{setItems([])}
    }, [])

    return (
        <Card hoverable={true} style={{borderRadius: 10}}>
            <Table
                rowKey={"id"}
                loading={tableLoading}
                size={'middle'}
                columns={columns}
                dataSource={items}
                locale={{emptyText: <Empty description={'暂无数据'}/>}}
                pagination={
                    {
                        defaultCurrent: 1,
                        total: pageInfo?.total,
                        current: pageInfo?.page,
                        pageSize: pageInfo?.size,
                        pageSizeOptions: [5, 10, 20, 50],
                        onChange: (page, size) => {
                            getItems(page, size)
                        },
                        showSizeChanger: true
                    }
                }
            >
            </Table>

            <Modal
                closeIcon={<CloseOutlined/>}
                title="用户详情"
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
                        name={'username'}
                        label={'账号'}
                        rules={[{required: true, message: '请输入公告内容'}]}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        name={'phone'}
                        label={'手机号码'}
                        rules={[
                            {
                                required: true,
                                message: '手机号码不合法！',
                                pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-7|9]|5[0-3|5-9]|6[5-7]|7[0-8]|8[\d]|9[1|89])\d{8}$/
                            }
                        ]}

                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name={'adminRole'}
                        label={'管理员'}
                        valuePropName={'checked'}

                    >
                        <Switch/>
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label={'密码'}
                        valuePropName={'checked'}

                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default User;