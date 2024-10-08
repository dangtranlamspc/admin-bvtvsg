
import React, { useEffect, useState } from 'react'
import { HeadComponent, ImagePicker } from '@/components'
import { useForm } from 'antd/es/form/Form';
import { useSearchParams } from 'next/navigation';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { HandleFile } from '@/utils/handleFile';
import { Button, Card, Form, Image, Input, message } from 'antd';

const AddNewTinTucSPC = () => {

  const [files, setFiles] = useState<any[]>([]);

  const [imgUrl, setImgUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false)

  const [form] = useForm()

  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  useEffect(() => {
  id && getTinTucSPCDetail(id);
  }, [id]);
  

  const getTinTucSPCDetail = async (id: string) => {
  try {
    const snap = await getDoc(doc(fs, `tintucspc/${id}`));
    if (snap.exists()) {
      const data = snap.data();

      form.setFieldsValue(data);

      if (data.imageUrl) {
        setImgUrl(data.imageUrl);
      }
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

  const handleAddNewTinTucSPC = async (values: any) => {
  setIsLoading(true);

  const data: any = {};

  for (const i in values) {
    data[`${i}`] = values[i] ?? '';
  }

  try {
    data.updatedAt = Date.now();

    const snap = id
      ? await updateDoc(doc(fs, `tintucspc/${id}`), data)
      : await addDoc(collection(fs, 'tintucspc'), {
          ...data,
          createdAt: Date.now(),
          rate: 0,
        });

    if (files && (snap || id)) {
      HandleFile.HandleFiles(
        files,
        id ? id : snap ? snap.id : '',
        'tintucspc'
      );
    }
    setIsLoading(false);
    window.history.back();
    form.resetFields();
  } catch (error: any) {
    message.error(error.message);
    setIsLoading(false);
  }
};
  return (
    <div>
    <HeadComponent
      title='THÊM MỚI TIN TỨC SPC'
      pageTitle='THÊM MỚI TIN TỨC SPC'
    />
    <div className="col-md-8 offset-md-2">
      <Card>
        <Form disabled={isLoading} 
          size='large'
          form={form}
          layout='vertical'
          onFinish={handleAddNewTinTucSPC}
        >
          <Form.Item name={'title'} label='TIÊU ĐỀ' rules={[{
            required : true,
            message : 'Điền tiêu đề'
          }]}>
            <Input placeholder='Tiêu đề' maxLength={150} allowClear />
          </Form.Item>
          <Form.Item name={'type'} label='Kiểu'>
            <Input />
          </Form.Item>
          <Form.Item name={'description'} label='Nội dung'>
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
        {files.length > 0 && (
          <div>
            <img
              src={URL.createObjectURL(files[0])}
              style={{
                width: 200,
                height: 'auto',
              }}
              alt=''
            />
          </div>
        )}
        {files.length === 0 && imgUrl ? (
        <Image src={imgUrl} style={{ width: 200 }} />
        ) : (
          <></>
          )}
        <ImagePicker
          loading={isLoading}
          onSelected={(vals) => setFiles(vals)}
        />
        <div className="mt-3 text-right">
          <Button loading={isLoading} type='primary' onClick={() => form.submit()} >Thêm</Button>
        </div>
      </Card>
    </div>
</div>
  )
}

export default AddNewTinTucSPC