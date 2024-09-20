import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase/firebaseConfig';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';
// import {DecoupledEditor} from 'ckeditor5'


interface CKEditorWrapperProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({ value, onChange }) => {


  const customUploadAdapter = (loader: any) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file: File) => {
            const storageRef = ref(storage, 'images/' + file.name);
            try {
              const snapshot = await uploadBytes(storageRef, file);
              const downloadURL = await getDownloadURL(snapshot.ref);
              resolve({ default: downloadURL });
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    };
  };

  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      editor={DecoupledEditor}
      config={{
        extraPlugins: [uploadPlugin],
      }}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        // onChange?.(data);
        onChange && onChange(data);
      }}
    />
  );
};

export default CKEditorWrapper;