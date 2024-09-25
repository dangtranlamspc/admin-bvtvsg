
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Image, Input, message, Select } from 'antd'
import { useForm } from 'antd/es/form/Form';
import { useSearchParams } from 'next/navigation';
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { HandleFile } from '@/utils/handleFile';
import { HeadComponent, ImagePicker } from '@/components';
import { BiAddToQueue } from 'react-icons/bi';
import { AddNewCategory } from '@/modals';

const CKEditorWrapper = dynamic(() => import('../../components/CKEditorWrapper'), {
    ssr: false,
  });

const AddNewNNDT: React.FC = () => {
    const [files, setFiles] = useState<any[]>([]);

  const [imgUrl, setImgUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false)

  const [categoriesnndt, setCategoriesNNDT] = useState<any[]>([]);

  const [isVisibleModalAddCategoryNNDT, setIsVisibleModalAddCategoryNNDT] = useState(false);

  const [form] = useForm()

  const searchParams = useSearchParams();

  const id = searchParams.get('id');


  useEffect(() => {
		id && getProductNNDTDetail(id);
	}, [id]);

  useEffect(() => {
		getCategoriesNNDT();
	}, []);

  const getProductNNDTDetail = async (id: string) => {
		try {
			const snap = await getDoc(doc(fs, `nndt/${id}`));
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

  const handleAddNewProduct = async (values: any) => {
		setIsLoading(true);

		const data: any = {};

		for (const i in values) {
			data[`${i}`] = values[i] ?? '';
		}

		try {
			data.updatedAt = Date.now();

			const snap = id
				? await updateDoc(doc(fs, `nndt/${id}`), data)
				: await addDoc(collection(fs, 'nndt'), {
						...data,
						createdAt: Date.now(),
						rate: 0,
				  });

			if (files && (snap || id)) {
				HandleFile.HandleFiles(
					files,
					id ? id : snap ? snap.id : '',
					'nndt'
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


  const getCategoriesNNDT = () => {
		onSnapshot(collection(fs, 'categoriesnndt'), (snap) => {
			if (snap.empty) {
				console.log('Data not found!');
				setCategoriesNNDT([]);
			} else {
				const items: any[] = [];

				snap.forEach((item: any) => {
					items.push({
						value: item.id,
						label: item.data().title,
					});
				});

				setCategoriesNNDT(items);
			}
		});
	};
  return (
    <div>
        <HeadComponent
          title='THÊM MỚI SẢN PHẨM'
          pageTitle='THÊM MỚI SẢN PHẨM'
          extra={
            <Button
              type='primary'
              onClick={() => setIsVisibleModalAddCategoryNNDT(true)}
              icon={<BiAddToQueue size={22} />}>
              Thêm mới danh mục sản phẩm
            </Button>
          }
			  />
        <div className="col-md-8 offset-md-2">
          <Card title='THÊM MỚI'>
            <Form disabled={isLoading} 
              size='large'
              form={form}
              layout='vertical'
              onFinish={handleAddNewProduct}
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
              <Form.Item name={'categoriesnndt'} label='Categories'>
							  <Select options={categoriesnndt} />
						  </Form.Item>
              <Form.Item name={'description'} label='Nội dung'>

                  <CKEditorWrapper />
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
        <AddNewCategory
          visible={isVisibleModalAddCategoryNNDT}
          onClose={() => setIsVisibleModalAddCategoryNNDT(false)}
        />
    </div>
  )
}

export default AddNewNNDT