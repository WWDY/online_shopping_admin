import React from 'react';
import {Button, Card, Col, Form, InputNumber, message} from "antd";
import TextArea from "antd/es/input/TextArea";
import axiosInstance, {ResultVO} from "../../axios/axios";

const AddNotice = () => {

    const [form] = Form.useForm();

    /**
     * function
     */
    const addNotice = (value: any) => {
        axiosInstance('/admin/notice/',{
            method: 'POST',
            data: JSON.stringify(value)
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                form.resetFields();
                message.success(resVO.message).then();
            }else{
                message.error(resVO.message).then();
            }
        }).catch()
    };

    return (
        <Col span={12}>
            <Card style={{borderRadius: 10,}}>
                <Form form={form} labelCol={{span:4}} onFinish={(value) => {addNotice(value)}}>
                    <Form.Item
                        label={"公告内容"}
                        name={'content'}
                        rules={[{required: true, message: '请输入公告内容'}]}
                    >
                        <TextArea/>
                    </Form.Item>
                    <Form.Item
                        label={"权重"}
                        name={'weight'}
                        initialValue={0}
                    >
                        <InputNumber min={0}/>
                    </Form.Item>
                    <Form.Item>
                       <Button style={{float:'right'}} type={"primary"} htmlType={"submit"}>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Col>

    );
};

export default AddNotice;