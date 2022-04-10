import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Form,
    Input,
    message,
    Popconfirm,
    Row,
    Select,
    Spin,
    Tree,
    TreeSelect
} from "antd";
import {
    SmileOutlined
} from '@ant-design/icons'
import axiosInstance, {PageVO, ResultVO} from "../../../axios/axios";

export interface TreeProp {
    key: string
    value: string
    title: string
    children?: TreeProp[]
}

const CategoryAdd = () => {

    /**
     * state
     */
    const [treeData, setTreeData] = useState<TreeProp[]>([])
    const [submitLoading, setSubmitLoading] = useState<boolean>(false)
    const [treeDataLoading, setTreeDataLoading] = useState<boolean>(false)

    /**
     * constant
     */
    const [form] = Form.useForm()

    /**
     * function
     */
    const handlerFinish = (formData: any) => {
        setSubmitLoading(true)
        axiosInstance('/admin/category/', {
            method: 'POST',
            data: JSON.stringify(formData)
        }).then(res => {
            const resVO = res.data as ResultVO;
            setSubmitLoading(false)
            if (resVO.code === 0) {
                form.resetFields();
                getTreeData()
                message.success(resVO.message).then(() => {
                })
            } else {
                message.error(resVO.message).then(() => {
                })
            }
        }).catch(() => {
        })
    }

    const getTreeData = () => {
        setTreeDataLoading(true)
        axiosInstance('/admin/category/tree', {
            method: 'GET'
        }).then(res => {
            const resVO = res.data as ResultVO;
            setTreeDataLoading(false)
            if (resVO.code === 0) {
                setTreeData(resVO.data)
            } else {
                message.error('获取数据失败，请稍后重试').then(() => {
                })
            }
        }).catch(() => {
        })
    }

    const delCategory = (id: string) => {
        axiosInstance('/admin/category/' + id, {
            method: 'DELETE'
        }).then(res => {
            const resVO = res.data as ResultVO;
            setTreeDataLoading(false)
            if (resVO.code === 0) {
                getTreeData()
                message.success(resVO.message).then(() => {
                })
            } else {
                message.error(resVO.message).then(() => {
                })
            }
        }).catch(() => {
        })
    }

    /**
     * hook
     */
    useEffect(() => {
        getTreeData()
    }, [])

    return (
        <div>
            <Row>
                <Col span={7}>
                    <Card title={'标签列表'} style={{borderRadius: 10}} hoverable={true}>
                        {
                            <Spin spinning={treeDataLoading}>
                                {treeData.length === 0 ? <Empty/> :
                                    <Tree height={500} selectable={false} titleRender={node => {
                                        return (
                                            <>
                                                <span>{node.title}</span>
                                                <div style={{display: "inline-block"}}>
                                                    <Popconfirm title={'确定要删除标签:' + node.title + '?'} okText={'确定'}
                                                                cancelText={'取消'} onConfirm={() => {
                                                        delCategory(node.key)
                                                    }}>
                                                        <Button type={"link"} danger={true}>删除</Button>
                                                    </Popconfirm>
                                                </div>
                                            </>
                                        )
                                    }
                                    } treeData={treeData}/>}
                            </Spin>
                        }
                    </Card>
                </Col>

                <Col span={15}>
                    <Card title={'添加标签'} style={{borderRadius: 10,marginLeft:'10px'}} hoverable={true}>
                        <Form
                            form={form}
                            onFinish={handlerFinish}
                            labelCol={{xl: 6, md: 5, sm: 6}}
                            /*wrapperCol={{xl:8,md:10,sm:18}}*/
                            name={'category'}
                        >
                            <Col xl={13} md={20} sm={24}>
                                <Form.Item
                                    name={'parentId'}
                                    label={"父标签"}
                                    rules={
                                        [
                                            {
                                                required: true,
                                                message: '父标签不能为空'
                                            }
                                        ]
                                    }
                                >
                                    <TreeSelect
                                        treeNodeFilterProp={'title'}
                                        showSearch={true}
                                        style={{width: '100%'}}
                                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                        treeData={[{value: '0', key: '0', title: '根标签'}].concat(treeData)}
                                        placeholder="请选择父标签"
                                        treeDefaultExpandAll
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={'name'}
                                    label={"标签名称"}
                                    rules={
                                        [
                                            {
                                                required: true,
                                                message: '标签名称不能为空'
                                            }
                                        ]
                                    }
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item style={{textAlign: 'right'}}>
                                    <Button loading={submitLoading} type={"primary"} htmlType={"submit"}>添加</Button>
                                </Form.Item>
                            </Col>
                        </Form>
                    </Card>
                </Col>


            </Row>

        </div>
    );
};

export default CategoryAdd;