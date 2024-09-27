import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

interface TinyMCEEditorProps {
    initialValue: string;
    onChange: (content: string, editor: TinyMCEEditor) => void;
  }

const TinyMCEEditors: React.FC<TinyMCEEditorProps> = ({ initialValue, onChange }) => {
    const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <Editor
		apiKey='5x7i1xpxvigj4ztpvzche6j60glkwmwc1f0wa5ts6qywlr9o'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={initialValue}
		init={{
			height: 500,
			menubar: true,
			plugins: [
				'advlist',
				'autolink',
				'lists',
				'link',
				'image',
				'charmap',
				'preview',
				'anchor',
				'searchreplace',
				'visualblocks',
				'code',
				'fullscreen',
				'insertdatetime',
				'media',
				'table',
				'code',
				'help',
				'wordcount',
			],
			toolbar:
				'undo redo | blocks | ' +
				'bold italic forecolor | alignleft aligncenter ' +
				'alignright alignjustify | bullist numlist outdent indent | ' +
				'removeformat | help',
			content_style:
				'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
		}}
        onEditorChange={onChange}
	/>
  )
}

export default TinyMCEEditors
