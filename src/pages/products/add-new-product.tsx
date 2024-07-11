import { HeadComponent, ImagePicker } from '@/components'
import { fs } from '@/firebase/firebaseConfig'
import { AddNewCategory } from '@/modals'
import { HandleFile } from '@/utils/handleFile'
import { Button, Card, Form, Input, message, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { BiAddToQueue } from 'react-icons/bi'

const AddNewProduct = () => {

  const [files, setFiles] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false)

  const [categories, setCategories] = useState<any[]>([]);

  const [isVisibleModalAddCategory, setIsVisibleModalAddCategory] = useState(false);

  const [form] = useForm()

  useEffect(() => {
		getCategories();
	}, []);

  const handleAddNewProduct = async(values : any) => {
    setIsLoading(true)

    const data : any ={}

    for (const i in values) {
      data[`${i}`] = values[i] ?? '';
    }

   try {
    const snap = await addDoc(collection(fs, 'products'), data)

    if (files) {
      HandleFile.HandleFiles(files, snap.id, 'products');
    }

    setIsLoading(false)
    window.history.back()
    form.resetFields()
   } catch (error : any) {
      message.error(error.message);
      setIsLoading(false)
   }
  }


  const getCategories = () => {
		onSnapshot(collection(fs, 'categories'), (snap) => {
			if (snap.empty) {
				console.log('Data not found!');
				setCategories([]);
			} else {
				const items: any[] = [];

				snap.forEach((item: any) => {
					items.push({
						value: item.id,
						label: item.data().title,
					});
				});

				setCategories(items);
			}
		});
	};

  // const optionSize = [
  //   {
  //     label : 'S',
  //     value : 'S'
  //   },
  //   {
  //     label : 'M',
  //     value : 'M'
  //   },
  //   {
  //     label : 'L',
  //     value : 'L'
  //   },
  //   {
  //     label : 'XL',
  //     value : 'XL'
  //   }
  // ]
    

  return (
    <div>
        <HeadComponent
          title='THÊM MỚI SẢN PHẨM'
          pageTitle='THÊM MỚI SẢN PHẨM'
          extra={
            <Button
              type='primary'
              onClick={() => setIsVisibleModalAddCategory(true)}
              icon={<BiAddToQueue size={22} />}>
              Add new category
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
              <Form.Item name={'categories'} label='Categories'>
							  <Select options={categories} />
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
            visible={isVisibleModalAddCategory}
            onClose={() => setIsVisibleModalAddCategory(false)}
          />
    </div>
  )
}

export default AddNewProduct