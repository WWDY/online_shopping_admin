import React, {useCallback, useState} from 'react';
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import styles from './index.module.less'
import {Underline} from "@tiptap/extension-underline";
import {Image} from "@tiptap/extension-image";
import {MacScrollbar} from "mac-scrollbar";
import {FormInstance} from "antd/lib/form/hooks/useForm";

type Props = {
    form?: FormInstance
    name?: string
}

const TipTapEditor = (props: Props) => {


    /**
     * tip-tap editor
     */
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                inline: true
            })
        ]
    })

    if(props.form && props.name){
        editor?.on('create',({editor}) => {
            editor.commands.setContent(
                props.form!.getFieldValue(props.name!)
            )
        })
        editor?.on('update',({editor})=>{
            if(editor.isEmpty){
                props.form?.setFieldsValue({
                    [props.name!]: null
                })
            }else{
                props.form?.setFieldsValue({
                    [props.name!]: editor.getHTML()
                })
            }
        })
    }

    return (
        <div className={styles.editor}>
            {editor && <MenuBar editor={editor}/>}
            <MacScrollbar>
                <EditorContent
                    className={styles.editor__content}
                    editor={editor}/>
            </MacScrollbar>
        </div>
    );
};

export default TipTapEditor;