import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Col, Form, Image, Input, InputNumber, message, Select} from "antd";
import {SpuStatus} from "../SPU";
import TipTapEditor from "../../TipTapEditor";
import TextArea from "antd/es/input/TextArea";
import axiosInstance, {ResultVO} from "../../../axios/axios";
import AliyunOssUpload from "../../AliyunOssUpload";

const UpdateShop = forwardRef((props: PropTypes, ref) => {

    useImperativeHandle(ref, () => ({
        finish: () => {
            form.submit();
        }
    }))

    /**
     * props
     */
    const {data} = props

    console.log(data)

    /**
     * state
     */
    const [form] = Form.useForm()
    const [spuList, setSpuList] = useState<any[]>([])

    /**
     * function
     */
    const getSupList = () => {
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


    const fillSpu = (id: any) => {
        const data = spuList.filter(spu => spu.id === id).at(0);
        form.setFieldsValue({...data, 'spuId': id})
    }

    const updateShop = () => {
        const spuId = form.getFieldValue('spuId')
        axiosInstance('/admin/shop/', {
            method: 'PATCH',
            data: JSON.stringify({...form.getFieldsValue(), 'spuId': spuId,"id":data.id})
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                props.getUpdateData({...form.getFieldsValue(), 'spuId': spuId,"id":data.id})
                message.success(resVO.message).then()
            } else {
                message.error(resVO.message).then()
            }
        }).catch(() => {
        })
    }


    /**
     * hook
     */

    useEffect(() => {
        const index = spuList.findIndex(spu => spu.id === data.spuId);
        form.setFieldsValue({...data, 'spu': data.spuId, ...spuList[index]})
    }, [spuList,data])


    useEffect(() => {
        (async () => {
            await getSupList()
        })()
    }, [])

    return (
        <div>
            <Col span={24} style={{margin: "30px auto"}}>
                <Form
                    form={form}
                    labelCol={{span: 3}}
                    wrapperCol={{span: 9}}
                    onFinish={() => {
                        updateShop()
                    }}
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
                        hidden={true}
                        label={'id'}
                        name={'id'}
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
                    <Form.Item
                        label={'商品标题'}
                        name={'title'}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        initialValue={0}
                        label={'库存'}
                        name={'stock'}
                    >
                        <InputNumber style={{width: '150px'}} min={0}/>
                    </Form.Item>
                    <Form.Item
                        label={'原价'}
                        name={'price'}
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
                        label={'现价'}
                        name={'discountPrice'}
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
                        wrapperCol={{span: 24}}
                    >
                        <AliyunOssUpload
                            uploadNumber={4}
                            url={data.sliderShow.join(',')}
                            getFileUrl={(url) => {
                                const urls: Array<string> = form.getFieldValue('sliderShow');
                                urls.push(url)
                            }}
                            remove={(url) => {
                                const urls: Array<string> = form.getFieldValue('sliderShow');
                                const index = urls.findIndex(item => url === item);
                                urls.splice(index, 1)
                            }}/>
                                </Form.Item>
                                <Form.Item
                                label={'商品详情'}
                                name={'shopDescription'}
                                wrapperCol={{span: 24}}
                                >
                                <TipTapEditor form={form} name={'shopDescription'}/>
                                </Form.Item>
                                </Form>
                                </Col>
                                </div>
                                );
                            });

                        type PropTypes = {
                        data: any,
                        getUpdateData: (data: any) => void
                    };

                        export default UpdateShop;