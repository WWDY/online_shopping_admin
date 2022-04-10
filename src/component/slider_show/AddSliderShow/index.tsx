import React, {ReactNode, useState} from 'react';
import {Button, Card, Col, Form, Input, InputNumber, message, Select} from "antd";
import {SettingOutlined} from "@ant-design/icons"
import AliyunOssUpload from "../../AliyunOssUpload";
import axiosInstance, {ResultVO} from "../../../axios/axios";


type Key = 'url' | 'name' | 'weight' | 'route'

const uploadDate: Record<Key, string> = {
    url: '',
    name: '',
    weight: '0',
    route: ''
}

const AddSliderShow = () => {




    const [step, setStep] = useState<number>(1);
    const [loading,setLoading] = useState<boolean>(false)

    const getFileUrl = (url: string) => {
        uploadDate.url = url
    }

    const inputData = (field: Key, value: string) => {
        uploadDate[field] = value;
    }

    const handlerFinish = () => {
        setLoading(true)
        axiosInstance('/admin/slider-show/',{
            method:'POST',
            data: JSON.stringify(uploadDate)
        }).then(res => {
            const resVO = res.data as ResultVO;
            setLoading(false)
            if (resVO.code === 0) {
                message.success(resVO.message).then(() => {})
            }else {
                message.error(resVO.message).then(() => {})
            }
        }).catch(() => {})
    }

    const after: ReactNode = (
        <Select onChange={(value) => {
            setStep(value)
        }} defaultValue={1} suffixIcon={<SettingOutlined/>} style={{width: 60}}>
            <Select.Option value={1}>1</Select.Option>
            <Select.Option value={5}>5</Select.Option>
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={20}>20</Select.Option>
        </Select>
    )


    return (
        <Col md={{span:20}} xl={{span:12}} lg={{span:13}}>
            <Card hoverable={true} style={{borderRadius: '10px'}} bordered={false}>
                <Form
                    layout={'vertical'}
                      onFinish={() => {
                          if (uploadDate.url.length === 0) {
                              message.warn('图片不能为空').then(() => {})
                          }else{
                              handlerFinish()
                          }
                    }
                }>
                    <Form.Item
                        label={"名称"}
                        name={'name'}
                        rules={[
                            {
                                required: true,
                                message: '名称不能为空'
                            }
                        ]}
                    >
                        <Col span={8}>
                            <Input onChange={(e) => {
                                inputData('name', e.target.value)
                            }}/>
                        </Col>
                    </Form.Item>
                    <Form.Item
                        label={'图片'}
                        rules={[
                            () => ({
                                required: true,
                                validator() {
                                    alert(1)
                                    if (uploadDate.url.length === 0) {
                                        message.warn('图片不能为空').then(() => {})
                                        return Promise.reject(message.warn('图片不能为空'))
                                    } else {
                                        return Promise.resolve()
                                    }
                                }
                            })
                        ]}
                    >
                        <AliyunOssUpload getFileUrl={getFileUrl}/>
                    </Form.Item>

                    <Form.Item
                        label={'路由'}
                        name={'route'}
                        rules={[
                            {
                                required: true,
                                message: '路由不能为空'
                            }
                        ]}
                    >
                        <Col span={8}>
                            <Input onChange={(e) => {inputData('route', e.target.value)}}/>
                        </Col>
                    </Form.Item>
                    <Col span={8}>
                        <Form.Item
                            initialValue={0}
                            label={'权重'}
                            name={'weight'}
                            rules={[
                                {
                                    required: true,
                                    message: '权重不能为空',
                                    type: 'number'
                                }
                            ]}
                        >
                            <InputNumber
                                max={Number.MAX_VALUE}
                                min={0}
                                step={step}
                                addonAfter={after}
                                onChange={(e: any) => {
                                    inputData('weight', e)
                                }}
                            />

                        </Form.Item>
                    </Col>
                    <Form.Item>
                        <Button loading={loading} htmlType={'submit'} type={'primary'} style={{textAlign: 'right'}}>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
    );
};

export default AddSliderShow;