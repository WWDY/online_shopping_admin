import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    Col,
    Empty,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Select,
    Table,
    Tag,
    TreeSelect
} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import styles from './index.module.less'
import {
    PlusOutlined,
    CloseOutlined
} from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea";
import axiosInstance, {PageVO, ResultVO} from "../../../axios/axios";
import {Method} from "axios";
import {TreeProp} from "../../category/CategoryAdd";

export enum SpuStatus {
    SHELVES = "上架",
    NO_SHELVES = "下架"
}


const SPU = () => {

    /**
     * state
     */
    const [treeData, setTreeData] = useState<TreeProp[]>([])
    const [requestMethod, setRequestMethod] = useState<Method>('POST')
    const [itemIndex, setItemIndex] = useState<number>(0);
    const [delLoading, setDelLoading] = useState<boolean[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [tableLoading, setTableLoading] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [items, setItems] = useState<any[]>([])
    const [pageInfo,setPageInfo] = useState<PageVO>();

    /**
     * constant
     */
    const [form] = Form.useForm()

    const columns: ColumnsType<object> = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '所属分类',
            dataIndex: 'categoryName',
        },
        {
            title: '描述',
            dataIndex: 'description',
            ellipsis: true,
        },
        {
            title: '重量(g)',
            dataIndex: 'weight',
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
            title: '操作',
            dataIndex: 'action',
            render: (_,item: any,index) => (
                <>
                    <Button size={'middle'} onClick={() => {
                        updateDate(item,index)
                    }} type={'link'}>修改</Button>
                    <Popconfirm title={'确认删除?'} okText={'确认'} cancelText={'取消'} onConfirm={() => del(item.id,index)}>
                        <Button loading={delLoading[index]} size={'middle'} danger={true} type={'text'}>删除</Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    const spuForm =
        <Col span={20}>
            <Form
                form={form}
                layout={'horizontal'}
                labelAlign={'right'}
                labelCol={{span:7}}
                onFinish={(forData) => {addSpu(forData)}}
            >
                <Form.Item hidden={true} name={"id"}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    label={'名称'}
                    name={'name'}
                    rules={
                        [
                            {
                                required: true,
                                message: '名称不能为空',
                                type: "string",
                                validator(_, value) {
                                    if (!value || value.length === 0) {
                                        return Promise.reject(new Error('名称不能为空'))
                                    } else {
                                        return Promise.resolve()
                                    }
                                }
                            }
                        ]
                    }
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label={'所属分类'}
                    name={'category'}
                    rules={
                        [
                            {
                                required: true,
                                message: '所属分类不能为空'
                            }
                        ]
                    }
                >
                    <TreeSelect
                        treeNodeFilterProp={'title'}
                        showSearch={true}
                        style={{width: '100%'}}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        treeData={treeData}
                        placeholder="请选择所属分类"
                        treeDefaultExpandAll
                    />
                </Form.Item>
                <Form.Item
                    label={'描述'}
                    name={'description'}
                    rules={
                        [
                            {
                                required: true,
                                message: '描述不能为空',
                                type: "string"
                            }
                        ]
                    }
                >
                    <TextArea allowClear/>
                </Form.Item>
                <Form.Item
                    required={true}
                    label={'重量'}
                    name={'weight'}
                    initialValue={0}
                    rules={
                        [
                            {
                                required: true,
                                message: '重量不能为空',
                                type: "number"
                            }
                        ]
                    }
                >
                    <InputNumber min={0} addonAfter={'g'}/>
                </Form.Item>
                <Form.Item
                    initialValue={'NO_SHELVES'}
                    label={'状态'}
                    name={'status'}
                    rules={
                        [
                            {
                                required: true,
                                message: '状态不能为空'
                            }
                        ]
                    }
                >
                    <Select>
                        <Select.Option value={'SHELVES'}>{SpuStatus.SHELVES}</Select.Option>
                        <Select.Option value={'NO_SHELVES'}>{SpuStatus.NO_SHELVES}</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Col>;


    /**
     * function
     */
    const updateDate = (item: any,index: number) => {
        setVisible(true)
        setRequestMethod('PATCH')
        setItemIndex(index)
        form.setFieldsValue(item)
    }

    const getCategoryName = (id: string, treeData: TreeProp[]): string | undefined => {
        for (let i = 0; i < treeData.length; i++) {
            if(treeData[i].value === id){
                return treeData[i].title
            }else if(treeData[i].children && treeData[i].children!.length > 0){
                const name = getCategoryName(id, treeData[i].children!)
                if(name){
                    return name;
                }
            }
        }

    }

    const getTreeData = () => {
        axiosInstance('/admin/category/tree', {
            method: 'GET'
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                setTreeData(resVO.data)
            } else {
                message.error('获取数据失败，请稍后重试').then(() => {
                })
            }
        }).catch(() => {
        })
    }

    const del = (id:number,index: number) => {
        delLoading[index] = true
        setDelLoading([...delLoading])
        axiosInstance("/admin/spu/"+id,{
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

    const getItems = (page: number = 1, size: number = 5) => {
        setTableLoading(true)
        axiosInstance('/admin/spu/', {
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

    const handleClick = () => {
        setVisible(true)
        setRequestMethod('POST')
    }

    const handelOk = () => {
        form.validateFields().then(() => {
            setLoading(true)
            form.submit()
        }).catch(() => {})
    }

    const addSpu = (item: any) => {
        axiosInstance('/admin/spu/',{
            method: requestMethod,
            data: JSON.stringify(item)
        }).then(res => {
            const resVO = res.data as ResultVO;
            setLoading(false)
            if (resVO.code === 0) {
                setVisible(false)
                form.resetFields();
                message.success(resVO.message).then(() => {})
                if(requestMethod === 'POST'){
                    getItems(pageInfo?.page,pageInfo?.size)
                }else if(requestMethod === 'PATCH'){
                    items[itemIndex] = item
                    items[itemIndex].categoryName = getCategoryName(item.category,treeData)
                    setItems(JSON.parse(JSON.stringify(items)))
                }
            }else {
                message.error(resVO.message).then(() => {})
            }
        }).catch(() => {})
    }

    /**
     * hook
     */
    useEffect(() => {
        getItems()
        getTreeData()
        return ()=>{setItems([])}
    }, [])

    return (
        <Card style={{borderRadius: 10}} hoverable={true}>
            <div className={styles.header}>
                <Button onClick={handleClick} type={'primary'} icon={<PlusOutlined/>}>添加</Button>
            </div>
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
                title="SPU"
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
                {spuForm}
            </Modal>
        </Card>
    );
};

export default SPU;