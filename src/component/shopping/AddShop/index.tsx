import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Image, Input, InputNumber, message, Select, Steps} from "antd";
import {ContainerOutlined, ProfileOutlined, DeliveredProcedureOutlined} from "@ant-design/icons";
import axiosInstance, {ResultVO} from "../../../axios/axios";
import TextArea from "antd/es/input/TextArea";
import AliyunOssUpload from "../../AliyunOssUpload";
import TipTapEditor from "../../TipTapEditor";
import {SpuStatus} from "../SPU";
import styles from './index.module.less'
import {MacScrollbar} from "mac-scrollbar";


const AddShop = () => {
    /**
     * state
     */
    const [current, setCurrent] = useState<number>(0);

    const [spuList, setSpuList] = useState<any[]>([])


    /**
     * constant
     */

    const [spuForm] = Form.useForm()

    const SPU =
        <Col span={9} style={{margin: "30px auto"}}>
            <Form
                form={spuForm}
                labelCol={{span: 7}}
                layout={'horizontal'}
                wrapperCol={{span: 12}}
            >
                <Form.Item
                    rules={[{required: true, message: 'SPU信息不能为空'}]}
                    name={'spu'}
                    label={'spu信息'}
                >
                    <Select
                        onSelect={(id: any) => {
                            fillSpu(id)
                        }}
                        style={{width: 200}}>
                        {
                            spuList.map(spu => {
                                return <Select.Option key={spu.id} value={spu.id}>{spu.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    hidden={true}
                    label={'id'}
                    name={'spuId'}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    label={'名称'}
                    name={'name'}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name={'categoryName'}
                    label={'所属分类'}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name={'description'}
                    label={'描述'}
                >
                    <TextArea disabled/>
                </Form.Item>
                <Form.Item
                    name={'weight'}
                    label={'重量(g)'}
                >
                    <Input disabled/>
                </Form.Item>
            </Form>
        </Col>

    const shopInfo =
        <Col span={24} style={{margin: "30px auto"}}>
            <Form
                form={spuForm}
                labelCol={{span: 3}}
                wrapperCol={{span: 9}}
            >
                <Form.Item
                    label={'商品标题'}
                    name={'title'}
                    rules={
                        [
                            {
                                required: true,
                                message: '商品标题不能为空'
                            }
                        ]
                    }
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    initialValue={0}
                    label={'库存'}
                    name={'stock'}
                    rules={
                        [
                            {
                                required: true,
                                message: '库存不能为空'
                            }
                        ]
                    }
                >
                    <InputNumber style={{width: '150px'}} min={0}/>
                </Form.Item>
                <Form.Item
                    label={'原价'}
                    name={'price'}
                    initialValue={0.00}
                    rules={
                        [
                            {
                                required: true,
                                message: '价格不能为空'
                            }
                        ]
                    }
                >
                    <InputNumber
                        prefix="￥"
                        style={{width: '150px'}}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                        stringMode
                    />
                </Form.Item>
                <Form.Item
                    label={'现价'}
                    name={'discountPrice'}
                    initialValue={0.00}
                >
                    <InputNumber
                        prefix="￥"
                        style={{width: '150px'}}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                        stringMode
                    />
                </Form.Item>
                <Form.Item
                    label={"上架状态"}
                    name={'status'}
                    required={true}
                    initialValue={'NO_SHELVES'}
                >
                    <Select style={{width: 150}}>
                        <Select.Option value={'SHELVES'}>{SpuStatus.SHELVES}</Select.Option>
                        <Select.Option value={'NO_SHELVES'}>{SpuStatus.NO_SHELVES}</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    initialValue={new Array<string>()}
                    label={'轮播图'}
                    name={'sliderShow'}
                >
                    <AliyunOssUpload
                        url={spuForm.getFieldValue('sliderShow') && spuForm.getFieldValue('sliderShow').join(",")}
                        uploadNumber={4}
                        getFileUrl={(url) => {
                            const urls: Array<string> = spuForm.getFieldValue('sliderShow');
                            urls.push(url)
                        }}
                        remove={(url) => {
                            const urls: Array<string> = spuForm.getFieldValue('sliderShow');
                            const index = urls.findIndex(item => url === item);
                            urls.splice(index, 1)
                        }
                        }
                    />
                </Form.Item>
                <Form.Item
                    label={'商品详情'}
                    name={'shopDescription'}
                    wrapperCol={{span: 24}}
                    rules={
                        [
                            {
                                required: true,
                                message: '商品详情不能为空'
                            }
                        ]
                    }
                >
                    <TipTapEditor form={spuForm} name={'shopDescription'}/>

                </Form.Item>
            </Form>
        </Col>;

    const showInfo =
        <Col span={24} style={{margin: "30px auto"}}>
            <Form
                form={spuForm}
                labelCol={{span: 3}}
                wrapperCol={{span: 9}}
                onFinish={(values) => {submitForm(values)}}
            >
                <Form.Item
                    label={'名称'}
                    name={'name'}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name={'categoryName'}
                    label={'所属分类'}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name={'description'}
                    label={'描述'}
                >
                    <TextArea disabled/>
                </Form.Item>
                <Form.Item
                    name={'weight'}
                    label={'重量(g)'}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    label={'商品标题'}
                    name={'title'}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    initialValue={0}
                    label={'库存'}
                    name={'stock'}
                >
                    <InputNumber disabled style={{width: '150px'}} min={0}/>
                </Form.Item>
                <Form.Item
                    label={'原价'}
                    name={'price'}
                    initialValue={0.00}
                >
                    <InputNumber
                        disabled
                        prefix="￥"
                        style={{width: '150px'}}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                        stringMode
                    />
                </Form.Item>
                <Form.Item
                    label={'现价'}
                    name={'discountPrice'}
                >
                    <InputNumber
                        disabled
                        prefix="￥"
                        style={{width: '150px'}}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                        stringMode
                    />
                </Form.Item>
                <Form.Item
                    label={"上架状态"}
                    name={'status'}
                >
                    <Select disabled={true} style={{width: 150}}>
                        <Select.Option value={'SHELVES'}>{SpuStatus.SHELVES}</Select.Option>
                        <Select.Option value={'NO_SHELVES'}>{SpuStatus.NO_SHELVES}</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    initialValue={new Array<string>()}
                    label={'轮播图'}
                    name={'sliderShow'}
                    wrapperCol={{span: 24}}
                >
                    <Image.PreviewGroup>
                        {
                            spuForm.getFieldValue('sliderShow') && spuForm.getFieldValue('sliderShow').map((image: string, index: number) => {
                                return (
                                    <Image width={200} key={'images' + index} src={image}/>
                                )
                            })
                        }
                    </Image.PreviewGroup>
                </Form.Item>
                <Form.Item
                    label={'商品详情'}
                    name={'shopDescription'}
                    wrapperCol={{span: 24}}
                >
                    <MacScrollbar>
                        <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{
                            __html: spuForm.getFieldValue('shopDescription')
                        }}/>
                    </MacScrollbar>
                </Form.Item>
            </Form>
        </Col>;

    const steps = [
        {
            title: 'SPU信息',
            content: SPU,
            icon: <ContainerOutlined/>
        },
        {
            title: '商品信息',
            content: shopInfo,
            icon: <ProfileOutlined/>
        },
        {
            title: 'SKU信息',
            content: showInfo,
            icon: <DeliveredProcedureOutlined/>
        },
    ];


    /**
     * function
     */
    const getSupList = async () => {
        axiosInstance('/admin/spu/all', {
            method: 'GET'
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                setSpuList(resVO.data)
            } else {
                message.error('获取spu列表失败，请刷新重试').then()
            }
        }).catch()
    }

    const submitForm = (values: any) => {
        const spuId = spuForm.getFieldValue('spuId')
        axiosInstance('/admin/shop/',{
            method: 'POST',
            data: JSON.stringify({...values,'spuId':spuId})
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                message.success(resVO.message).then()
            }else{
                message.error(resVO.message).then()
            }
        }).catch(()=>{})
    }


    const fillSpu = (id: any) => {
        const data = spuList.filter(spu => spu.id === id).at(0);
        spuForm.setFieldsValue({...data,'spuId':id})
    }

    const next = () => {
        if (current === 0) {
            spuForm.validateFields().then(() => {
                setCurrent(current + 1);
            }).catch(() => {
            })
        } else if (current === 1) {
            spuForm.validateFields().then(() => {
                setCurrent(current + 1);
            }).catch(() => {
            })
        }

    };

    const prev = () => {
        setCurrent(current - 1);
    };

    /**
     * hook
     */
    useEffect(() => {
        (async () => {
            await getSupList()
        })()
    }, [])


    /**
     * return
     */
    return (
        <Card style={{borderRadius: 10}} hoverable={true}>
            <Steps current={current}>
                {steps.map(item => (
                    <Steps.Step key={item.title} title={item.title} icon={item?.icon}/>
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action">
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        下一步
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => {
                        spuForm.submit();
                    }}>
                        完成
                    </Button>
                )}
                {current > 0 && (
                    <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                        上一步
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default AddShop;