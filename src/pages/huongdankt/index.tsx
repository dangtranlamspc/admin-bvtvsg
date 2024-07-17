import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Modal, Space, Tooltip } from 'antd'
import { useRouter } from 'next/router';
import { HuongDanKTModel } from '@/models/HuongDanKTModel';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import Table, { ColumnProps } from 'antd/es/table';
import { FaEdit } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';


const { confirm } = Modal;
const HuongDanKyThuat = () => {
    const router = useRouter();
	const [huongdankt, setHuongDanKT] = useState<HuongDanKTModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'huongdankt'), (snap) => {
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

				setHuongDanKT(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: HuongDanKTModel) => (
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
			title: '',
			align: 'right',
			dataIndex: '',
			render: (item) => (
				<Space>
					<Tooltip title='Chỉnh sửa tin'>
						<Button
							type='text'
							icon={<FaEdit color='#676767' size={20} />}
							onClick={() =>
								router.push(`/huongdankt/add-new-huongdankt?id=${item.id}`)
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
			render: (item: HuongDanKTModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete ?',
								onOk: () => handleDeleteHuongDanKT(item),
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

	const handleDeleteHuongDanKT = async (item: HuongDanKTModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `huongdankt/${item.id}`));
	};
  return (
<>
			<HeadComponent
				title='HƯỚNG DẪN KỸ THUẬT'
				pageTitle='HƯỚNG DẪN KỸ THUẬT'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/huongdankt/add-new-huongdankt')}>
						Thêm mới
					</Button>
				}
			/>
			<Table dataSource={huongdankt} columns={columns} />
		</>
  )
}

export default HuongDanKyThuat