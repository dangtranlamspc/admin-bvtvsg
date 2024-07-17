import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Modal, Space, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { NhaVuonModel } from '@/models/NhaVuonModel'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { fs } from '@/firebase/firebaseConfig'
import Table, { ColumnProps } from 'antd/es/table'
import { FaEdit } from 'react-icons/fa'
import { BiTrash } from 'react-icons/bi'
import { HandleFile } from '@/utils/handleFile'

const { confirm } = Modal;
const ConTrungTrongNhaVuon = () => {
	const router = useRouter();

	const [nhavuons, setNhaVuons] = useState<NhaVuonModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'nhavuons'), (snap) => {
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

				setNhaVuons(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: NhaVuonModel) => (
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
			render: (item: NhaVuonModel) => (
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

	const handleDeleteNhaVuon = async (item: NhaVuonModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `nhavuons/${item.id}`));
	};
  return (
        <>
			<HeadComponent
				title='CÔN TRÙNG TRONG NHÀ VƯỜN'
				pageTitle='CÔN TRÙNG TRONG NHÀ VƯỜN'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/nhavuons/add-new-nhavuon')}>
						Add new
					</Button>
				}
			/>
			<Table dataSource={nhavuons} columns={columns} />
		</>
  )
}

export default ConTrungTrongNhaVuon