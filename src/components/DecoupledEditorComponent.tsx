import React, { useEffect, useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';


interface DecoupledEditorProps {
    value?: string;
    onChange?: (value: string) => void;
  }

const DecoupledEditorComponent : React.FC<DecoupledEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<any>();
    const [editorLoaded, setEditorLoaded] = useState(false);
  
    useEffect(() => {
      setEditorLoaded(true);
    }, []);
  return (
    <div>
      {editorLoaded ? (
        <CKEditor
        //   onReady={(editor: any) => {
        //     console.log('Editor is ready to use!', editor);
        //     editor.ui.getEditableElement().parentElement.insertBefore(
        //       editor.ui.view.toolbar.element,
        //       editor.ui.getEditableElement()
        //     );
        //     editorRef.current = editor;
        //   }}
        //   onError={(error: any, { willEditorRestart }: { willEditorRestart: boolean }) => {
        //     if (willEditorRestart) {
        //       editorRef.current.ui.view.toolbar.element.remove();
        //     }
        //   }}
          // onChange={(event: any, editor: any) => {
          //   const data = editor.getData();
          //   onChange(data);
          // }}
          // editor={DecoupledEditor}
          // data={data}
          editor={DecoupledEditor}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();
            // onChange?.(data);
            onChange && onChange(data);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  )
}

export default DecoupledEditorComponent