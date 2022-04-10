import {Button, Modal, Tooltip, Upload} from 'antd';
import {LoadingOutlined, PictureOutlined, PlusOutlined} from '@ant-design/icons';
import axiosInstance, {ResultVO} from '../../axios/axios'
import React, {useEffect, useState} from "react";
import {UploadChangeParam} from "antd/es/upload";
import {RcFile, UploadFile} from "antd/lib/upload/interface";
import styles from '../TipTapEditor/MenuBar/index.module.less'

interface OssData {
    dir?: string,
    expire: number,
    host: string,
    accessId: string,
    policy: string,
    signature: string
}

interface OssUploadData {
    key: string,
    OSSAccessKeyId: string,
    policy: string,
    Signature: string,
}

type PropsType = {
    getFileUrl: (url: string) => void;
    url?: string,
    uploadNumber?: number
    type?: string
    remove?: (url: string | undefined) => void
}


function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const AliyunOssUpload = (props: PropsType) => {

    const [ossData, setOssData] = useState<OssData>()
    const [loading, setLoading] = useState<boolean>(false)
    const [imgUrl, setImgUrl] = useState<string|undefined>('')
    const [preview, setPreview] = useState<boolean>(false)
    const [previewTitle, setPreviewTitle] = useState<string>('')
    const [fileList, setFileList] = useState<any[]>([])

    const getOssData = async () => {
        await axiosInstance('/oss/signature/', {
            method: 'GET'
        }).then(res => {
            const resVO = res.data as ResultVO;
            if (resVO.code === 0) {
                const data = resVO.data as OssData;
                setOssData(data)
            }
        }).catch()
    }

    useEffect(() => {
        if (props.url) {
            const urls = props.url.split(",");
            setImgUrl(urls[0])
            setFileList(urls.map(url => {
                return {url:url}
            }))
            setPreviewTitle(urls[0])
        }
        (
            async () => await getOssData()
        )()
    }, [])

    const getExtraData = (file: any): any => {
        const extraData: OssUploadData = {
            key: ossData?.dir + file.url,
            OSSAccessKeyId: ossData!.accessId,
            policy: ossData!.policy,
            Signature: ossData!.signature,
        }
        return extraData as any;
    };

    const onChange = (file: UploadChangeParam<UploadFile>) => {
        setFileList(file.fileList)
        if (file.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (file.file.status === 'done') {
            const url = ossData?.host! + '/' + ossData?.dir + file.file.url
            file.file.url = url;
            props.getFileUrl(url)
            setLoading(false)
        }
    };
    const beforeUpload = async (file: RcFile): Promise<RcFile> => {
        const expire = ossData?.expire

        if (expire! < Date.now()) {
            await getOssData()
        }

        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        const resFile = file as any;
        resFile.url = filename;
        return resFile;
    }
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>上传</div>
        </div>
    );

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj) as string;
        }
        setImgUrl(file.url || file.preview)
        setPreviewTitle(file.name)
        setPreview(true)
    };

    const handleCancel = () => setPreview(false);

    const handlerRemove = (file: UploadFile) => {
        setImgUrl('')
        const index = fileList.findIndex(files => files.uid === file.uid);
        const temp = [...fileList]
        temp.splice(index,1)
        setFileList(fileList)
        if(props.uploadNumber && props.uploadNumber > 1){
            props.remove && props.remove(file.url)
        }else{
            props.getFileUrl('')
        }
        let filePath = ossData?.dir! + file.url
        if (file.url?.startsWith("https")) {
            filePath = file.url.substring("https://wwdy-online-shopping.oss-cn-beijing.aliyuncs.com/".length)
        }
        axiosInstance("/oss/object/" + filePath, {
            method: 'DELETE'
        })
    }

    return (
        <>
            <Upload
                onChange={onChange}
                beforeUpload={beforeUpload}
                data={getExtraData}
                showUploadList={(props.type && props.type) !== 'editor'}
                action={ossData?.host}
                listType={(props.type && props.type) === 'editor' ? undefined : "picture-card"}
                className={"avatar-uploader"}
                onPreview={handlePreview}
                onRemove={handlerRemove}
                fileList={fileList}
            >
                {
                    (props.type && props.type) === 'editor'
                        ?
                        (
                            <Tooltip title={'插入图片'}><Button className={styles.button} type={"text"} icon={<PictureOutlined/>}/></Tooltip>
                        )
                        :
                        (
                            props.uploadNumber ? fileList.length > (props.uploadNumber - 1) ? null : uploadButton : fileList.length > 0 ? null : uploadButton
                        )
                }
            </Upload>
            {
                (props.type && props.type) === 'editor' ? <></> : <Modal
                    visible={preview}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img alt="example" style={{width: '100%'}} src={imgUrl}/>
                </Modal>
            }
        </>

    );


}

export default AliyunOssUpload

