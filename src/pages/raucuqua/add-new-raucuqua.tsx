import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HeadComponent, ImagePicker } from '@/components'
import { useForm } from 'antd/es/form/Form';
import { useSearchParams } from 'next/navigation';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { HandleFile } from '@/utils/handleFile';
import { Button, Card, Form, Image, Input, message } from 'antd';
import { BiAddToQueue } from 'react-icons/bi';

const AddNewRauCuQua = () => {
    const [files, setFiles] = useState<any[]>([]);

    const [imgUrl, setImgUrl] = useState('');
  
    const [isLoading, setIsLoading] = useState(false)

    const [form] = useForm()

    const searchParams = useSearchParams();

    const id = searchParams.get('id');


    useEffect(() => {
		id && getRauCuQuaDetail(id);
	  }, [id]);
    

    const getRauCuQuaDetail = async (id: string) => {
		try {
			const snap = await getDoc(doc(fs, `raucuqua/${id}`));
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

    const handleAddNewauCuQua = async (values: any) => {
		setIsLoading(true);

		const data: any = {};

		for (const i in values) {
			data[`${i}`] = values[i] ?? '';
		}

		try {
			data.updatedAt = Date.now();

			const snap = id
				? await updateDoc(doc(fs, `raucuqua/${id}`), data)
				: await addDoc(collection(fs, 'raucuqua'), {
						...data,
						createdAt: Date.now(),
						rate: 0,
				  });

			if (files && (snap || id)) {
				HandleFile.HandleFiles(
					files,
					id ? id : snap ? snap.id : '',
					'raucuqua'
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
          title='THÊM MỚI SẢN PHẨM'
          pageTitle='THÊM MỚI SẢN PHẨM'
			  />
        <div className="col-md-8 offset-md-2">
          <Card title='THÊM MỚI'>
            <Form disabled={isLoading} 
              size='large'
              form={form}
              layout='vertical'
              onFinish={handleAddNewauCuQua}
            >
              <Form.Item name={'title'} label='TÊN SẢN PHẨM' rules={[{
                required : true,
                message : 'Điền tên của sản phẩm'
              }]}>
                <Input placeholder='Tên sản phẩm' maxLength={150} allowClear />
              </Form.Item>
              <Form.Item name={'type'} label='Type'>
                <Input />
              </Form.Item>
              <Form.Item name={'description'} label='Nội dung'>
                <Input.TextArea rows={10} />
              </Form.Item>
              <Form.Item name={'price'} label='Giá'>
                <Input type='number'/>
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

export default AddNewRauCuQua