import React, {ReactNode, useEffect, useState} from 'react';
import { Col, Form, Input, InputNumber, message, Modal, Select} from "antd";
import AliyunOssUpload from "../../AliyunOssUpload";
import {SettingOutlined} from "@ant-design/icons";
import axiosInstance, {ResultVO} from "../../../axios/axios";
import {useNavigate} from "react-router-dom";

type Key = 'url' | 'name' | 'weight' | 'route'

let uploadDate: Record<Key, string> = {
    url: '',
    name: '',
    weight: '0',
    route: ''
}

type Props = {
    formData: Record<Key, string>
    updateNode: any,
    index: number
    refreshData: any
}

const UpdateSliderShow = (props: Props) => {

    const inputData = (field: Key, value: string) => {
        uploadDate[field] = value;
    }

    const getFileUrl = (url: string) => {
        uploadDate.url = url
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

    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()

    useEffect(()=>{
        form.setFieldsValue(props.formData)
        uploadDate = props.formData
    },[])

    const handelOk = () => {
        form.validateFields()
            .then(() => {
                setLoading(true)
                axiosInstance('/admin/slider-show/',{
                    method:'PATCH',
                    data: JSON.stringify(uploadDate)
                }).then(res => {
                    const resVO = res.data as ResultVO;
                    setLoading(false)
                    if (resVO.code === 0) {
                        props.updateNode(<></>)
                        props.refreshData()
                        message.success(resVO.message).then(() => {})
                    }else{
                        message.error(resVO.message).then(() => {})
                    }
                })
            }).catch(()=>{})
    }

    return (
        <Modal onOk={handelOk} okButtonProps={{loading:loading}} visible={true} onCancel={() => {
            props.updateNode(<></>)
        }}>
            <Form
                form={form}
                layout={'vertical'}
                onFinish={() => {
                    if (uploadDate.url.length === 0) {
                        message.warn('图片不能为空').then(() => {
                        })
                    } else {

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
                        <Input defaultValue={props.formData.name} onChange={(e) => {
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
                                    message.warn('图片不能为空').then(() => {
                                    })
                                    return Promise.reject(message.warn('图片不能为空'))
                                } else {
                                    return Promise.resolve()
                                }
                            }
                        })
                    ]}
                >
                    <AliyunOssUpload url={props.formData.url} getFileUrl={getFileUrl}/>
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
                        <Input defaultValue={props.formData.route} onChange={(e) => {
                            inputData('route', e.target.value)
                        }}/>
                    </Col>
                </Form.Item>
                <Col span={8}>
                    <Form.Item
                        initialValue={props.formData.weight}
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
            </Form>
        </Modal>
    );
};

export default UpdateSliderShow;