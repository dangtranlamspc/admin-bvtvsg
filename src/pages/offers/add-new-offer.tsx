import { ImagePicker } from '@/components';
import { HandleFile } from '@/utils/handleFile';
import { Button, Card, DatePicker, Form, Input } from 'antd';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { generatorRandomText } from '@/utils/generatorRandomText';
import { fs } from '@/firebase/firebaseConfig';

const date = new Date();
const AddNewOffer = () => {
	const [files, setFiles] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const [form] = Form.useForm();

	useEffect(() => {
		const str = generatorRandomText();
		form.setFieldValue('code', str);
	}, []);

	const addNewOffer = async (values: any) => {
		const data: any = {};

		for (const i in values) {
			data[`${i}`] = values[i] ?? '';
		}

		data.startAt = new Date(values.startAt.$d).getTime();
		data.endAt = new Date(values.endAt.$d).getTime();

		try {
			const snap = await addDoc(collection(fs, 'offers'), {
				...data,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});

			if (files) {
				HandleFile.HandleFiles(files, snap.id, 'offers');
			}

			form.resetFields();
			window.history.back();
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	return (
		<div className='col-md-8 offset-md-2'>
			<Card>
				<Form
					disabled={isLoading}
					layout='vertical'
					form={form}
					onFinish={addNewOffer}>
					<Form.Item
						name={'title'}
						label='TIÊU ĐỀ'
						rules={[
							{
								required: true,
								message: 'Hãy nhập nội dung',
							},
						]}>
						<Input placeholder='title' allowClear />
					</Form.Item>
					<Form.Item name={'description'} label='NỘI DUNG'>
						<Input.TextArea rows={2} placeholder='Description' allowClear />
					</Form.Item>
					<div className='row'>
						<div className='col'>
							<Form.Item
								name={'startAt'}
								initialValue={dayjs(date)}
								label='NGÀY BẮT ĐẦU'
								>
								<DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
							</Form.Item>
						</div>
						<div className='col'>
							<Form.Item 
								name={'endAt'} 
								label='NGÀY KẾT THÚC' 
								rules={[
									{
										required: true,
										message: 'Hãy chọn ngày kết thúc',
									},
								]}
							>
								<DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
							</Form.Item>
						</div>
					</div>
					<Form.Item 
						name={'percent'} 
						label='PHẦN TRĂM' 
						rules={[
							{
								required: true,
								message: 'Hãy nhập phần trăm',
							},
						]}
					>
						<Input 
							type='number' 
							placeholder='percent' 
							allowClear 
						/>
					</Form.Item>
					<Form.Item 
						name={'code'} 
						label='Code' 
						rules={[
							{
								required: true,
								message: 'Hãy nhập mã',
							},
						]}
					>
						<Input placeholder='Code' />
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
				<div className='text-right'>
					<Button
						loading={isLoading}
						type='primary'
						onClick={() => form.submit()}>
						TẢI LÊN
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default AddNewOffer;