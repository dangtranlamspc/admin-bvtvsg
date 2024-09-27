
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { useForm } from 'antd/es/form/Form';
import { HandleFile } from '@/utils/handleFile';
import { Button, Card, Form, Image, Input, message, Select } from 'antd';
import { HeadComponent, ImagePicker } from '@/components';

const AddNewCategories = () => {

    const [imgUrl, setImgUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const [files, setFiles] = useState<any[]>([]);

    const id = searchParams.get('id');

    const [form] = useForm()

    useEffect(() => {
		id && getCategoriesDetail(id);
	}, [id]);
    
    const getCategoriesDetail = async (id: string) => {
		try {
			const snap = await getDoc(doc(fs, `categories/${id}`));
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

    const handleAddNewCategories = async (values: any) => {
		setIsLoading(true);

		const data: any = {};

		for (const i in values) {
			data[`${i}`] = values[i] ?? '';
		}

		try {
			data.updatedAt = Date.now();

			const snap = id
				? await updateDoc(doc(fs, `categories/${id}`), data)
				: await addDoc(collection(fs, 'categories'), {
						...data,
						createdAt: Date.now(),
						rate: 0,
				  });

			if (files && (snap || id)) {
				HandleFile.HandleFiles(
					files,
					id ? id : snap ? snap.id : '',
					'categories'
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
          title='THÊM MỚI DANH MỤC SẢN PHẨM'
          pageTitle='HÊM MỚI DANH MỤC SẢN PHẨM'
		/>
        <div className="col-md-8 offset-md-2">
          <Card title='THÊM MỚI'>
            <Form disabled={isLoading} 
              size='large'
              form={form}
              layout='vertical'
              onFinish={handleAddNewCategories}
            >
                <Form.Item name={'title'} label='TÊN DANH MỤC' rules={[{
                    required : true,
                    message : 'Điền tên danh mục'
                }]}>
                    <Input placeholder='Tên sản phẩm' maxLength={150} allowClear />
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

export default AddNewCategories