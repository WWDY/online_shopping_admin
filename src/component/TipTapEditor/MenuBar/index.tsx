import React from 'react';
import styles from './index.module.less'
import globalStyles from '../index.module.less'
import {
    BoldOutlined,
    ItalicOutlined,
    StrikethroughOutlined,
    CodeOutlined,
    UnderlineOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    BlockOutlined, LinkOutlined, PictureOutlined
} from '@ant-design/icons'
import {Button, Tooltip} from "antd";
import {Editor} from "@tiptap/react";
import {H1} from "../../Icon";
import AliyunOssUpload from "../../AliyunOssUpload";

type Props = {
    editor: Editor
}

const MenuBar = (props: Props) => {

    const {editor} = props

    /**
     * constant
     */
    const items = [
        {
            icon: <BoldOutlined/>,
            title: '加粗',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: <ItalicOutlined/>,
            title: '斜体',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: <StrikethroughOutlined/>,
            title: '删除线',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            icon: <UnderlineOutlined />,
            title: '下划线',
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: () => editor.isActive('underline'),
        },
        {
            icon: <CodeOutlined />,
            title: '代码块',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        {
            type: 'divider',
        },
        {
            icon: 'H1',
            title: '标题 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: 'H2',
            title: '标题 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: 'H3',
            title: '标题 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
            icon: <UnorderedListOutlined />,
            title: '无序列表',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: <OrderedListOutlined />,
            title: '有序列表',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            type: 'divider',
        },
        {
            icon: <BlockOutlined />,
            title: '块引用',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: <PictureOutlined />,
            title: '插入图片',
            component: <AliyunOssUpload key={"aliyunOssUpload"} type={'editor'} getFileUrl={(url) => {
                editor.chain().focus().setImage({src:url}).run()
            }}/>,
            isActive: () => editor.isActive('blockquote'),
        },

        /*


        {
            type: 'divider',
        },

        {
            icon: 'separator',
            title: 'Horizontal Rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
            type: 'divider',
        },
        {
            icon: 'text-wrap',
            title: 'Hard Break',
            action: () => editor.chain().focus().setHardBreak().run(),
        },
        {
            icon: 'format-clear',
            title: 'Clear Format',
            action: () => editor.chain().focus().clearNodes().unsetAllMarks()
                .run(),
        },
        {
            type: 'divider',
        },
        {
            icon: 'arrow-go-back-line',
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
        },
        {
            icon: 'arrow-go-forward-line',
            title: 'Redo',
            action: () => editor.chain().focus().redo().run(),
        },*/
    ]

    return (
        <div className={globalStyles.editor__header}>
            {
                items.map((item,index) => {
                    return item.type === 'divider' ? <div key={index} className={styles.divider}/> :
                        (
                            item.component ? item.component :
                            <Tooltip key={index} title={item.title}>
                                <Button
                                    type={"text"}
                                    icon={item.icon}
                                    onClick={item.action}
                                    className={item.isActive && item.isActive() ? styles.button_active : styles.button}
                                />
                            </Tooltip>
                        )
                })
            }
        </div>
    );
};

export default MenuBar;