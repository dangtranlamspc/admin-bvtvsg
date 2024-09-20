import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Card, DatePicker, Form, Image, Input, message, Select } from 'antd';
import { generatorRandomText } from '@/utils/generatorRandomText';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { HandleFile } from '@/utils/handleFile';
import dayjs from 'dayjs';
import { HeadComponent, ImagePicker } from '@/components';
import { useSearchParams } from 'next/navigation';

const date = new Date();
const AddNewSliderHome = () => {

    const [files, setFiles] = useState<any[]>([]);
    const [imgUrl, setImgUrl] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [form] = Form.useForm();

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
		id && getSliderDetail(id);
	}, [id]);

    const getSliderDetail = async (id: string) => {
		try {
			const snap = await getDoc(doc(fs, `sliders/${id}`));
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

    const handleAddNewSlider = async (values: any) => {
		setIsLoading(true);

		const data: any = {};

		for (const i in values) {
			data[`${i}`] = values[i] ?? '';
		}

		try {
			data.updatedAt = Date.now();

			const snap = id
				? await updateDoc(doc(fs, `sliders/${id}`), data)
				: await addDoc(collection(fs, 'sliders'), {
						...data,
						createdAt: Date.now(),
						rate: 0,
				  });

			if (files && (snap || id)) {
				HandleFile.HandleFiles(
					files,
					id ? id : snap ? snap.id : '',
					'sliders'
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
              onFinish={handleAddNewSlider}
            >
              <Form.Item name={'title'} label='TÊN SLIDE' rules={[{
                required : true,
                message : 'Điền tên của slide'
              }]}>
                <Input placeholder='Tên slide' maxLength={150} allowClear />
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

export default AddNewSliderHome