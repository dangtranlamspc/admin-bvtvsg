import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { AvatarComponent, HeadComponent } from '@/components';
import { Button, Modal, Space, Tooltip } from 'antd';
import { RongReuModel } from '@/models/RongReuModel';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import Table, { ColumnProps } from 'antd/es/table';
import { FaEdit } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';

const { confirm } = Modal;
const RongReu = () => {
    const router = useRouter();
	const [rongrieu, setRongRieu] = useState<RongReuModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'rongrieu'), (snap) => {
			if (snap.empty) {
				console.log('Data not found!');
			} else {
				const items: any[] = [];

				snap.forEach((item: any) => {
					items.push({
						id: item.id,
						...item.data(),
					});
				});

				setRongRieu(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: RongReuModel) => (
				<AvatarComponent
					imageUrl={item.imageUrl}
					id={item.files && item.files.length > 0 ? item.files[0] : ''}
					path='files'
				/>
			),
		},
		{
			key: 'title',
			dataIndex: 'title',
			title: 'TIÊU ĐỀ',
		},
		{
			key: 'type',
			dataIndex: 'type',
			title: 'PHÂN LOẠI',
		},
		{
			key: 'Price',
			title: 'GIÁ (VNĐ)',
			dataIndex: 'price',
		},
		{
			title: '',
			align: 'right',
			dataIndex: '',
			render: (item) => (
				<Space>
					<Tooltip title='Chỉnh sửa sản phẩm'>
						<Button
							type='text'
							icon={<FaEdit color='#676767' size={20} />}
							onClick={() =>
								router.push(`/nhavuons/add-new-nhavuon?id=${item.id}`)
							}
						/>
					</Tooltip>
				</Space>
			),
		},

		{
			key: 'btn',
			title: '',
			dataIndex: '',
			render: (item: RongReuModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete ?',
								onOk: () => handleDeleteNhaVuon(item),
							})
						}
						icon={<BiTrash size={20} />}
						danger
						type='text'
					/>
				</Space>
			),
			align: 'right',
		},
	]

	const handleDeleteNhaVuon = async (item: RongReuModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `rongrieu/${item.id}`));
	};
  return (
        <>
			<HeadComponent
				title='RONG RÊU - SINH VẬT THỦY CẢNH'
				pageTitle='RONG RÊU - SINH VẬT THỦY CẢNH'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/rongrieu/add-new-ctgd-rongrieu')}>
						Thêm mới
					</Button>
				}
			/>
			<Table dataSource={rongrieu} columns={columns} />
		</>
  )
}

export default RongReu