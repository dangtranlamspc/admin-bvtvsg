import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Modal, Space, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { HoaCayKiengModel } from '@/models/HoaCayKiengModel';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import Table, { ColumnProps } from 'antd/es/table';
import { FaEdit } from 'react-icons/fa';
import { FcAddImage } from 'react-icons/fc';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';


const { confirm } = Modal;
const NNDTHoaCayKieng = () => {

    const router = useRouter();

	const [hoacaykiengs, setHoaCayKiengs] = useState<HoaCayKiengModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'hoacaykieng'), (snap) => {
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

				setHoaCayKiengs(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: HoaCayKiengModel) => (
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
			title: 'TÊN SẢN PHẨM',
		},
		{
			key: 'type',
			dataIndex: 'type',
			title: 'TIÊU ĐỀ',
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
								router.push(`/hoacaykieng/add-new-nndt-hoacaykieng?id=${item.id}`)
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
			render: (item: HoaCayKiengModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete ?',
								onOk: () => handleDeletHoaCayKieng(item),
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

	const handleDeletHoaCayKieng = async (item: HoaCayKiengModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `hoacaykieng/${item.id}`));
	};
  return (
		<>
			<HeadComponent
				title='HOA - CÂY KIỂNG'
				pageTitle='HOA - CÂY KIỂNG'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/hoacaykieng/add-new-nndt-hoacaykieng')}>
						Add new
					</Button>
				}
			/>
			<Table dataSource={hoacaykiengs} columns={columns} />
		</>
  )
}

export default NNDTHoaCayKieng