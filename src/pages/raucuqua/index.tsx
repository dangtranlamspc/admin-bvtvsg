import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Modal, Space, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { RauCuQuaModel } from '@/models/RauCuQuaModel'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { fs } from '@/firebase/firebaseConfig'
import Table, { ColumnProps } from 'antd/es/table'
import { FaEdit } from 'react-icons/fa'
import { BiTrash } from 'react-icons/bi'
import { HandleFile } from '@/utils/handleFile'

const { confirm } = Modal;
const RauCuQua = () => {
    const router = useRouter();

	const [raucuquas, setRauCuQuas] = useState<RauCuQuaModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'raucuqua'), (snap) => {
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

				setRauCuQuas(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: RauCuQuaModel) => (
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
								router.push(`/raucuqua/add-new-raucuqua?id=${item.id}`)
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
			render: (item: RauCuQuaModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete Hoa Cay Kieng?',
								onOk: () => handleDeletRauCuQua(item),
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

	const handleDeletRauCuQua = async (item: RauCuQuaModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `raucuqua/${item.id}`));
	};
  return (
        <>
			<HeadComponent
				title='RAU - CỦ - QUẢ'
				pageTitle='RAU - CỦ - QUẢ'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/raucuqua/add-new-raucuqua')}>
						Thêm mới
					</Button>
				}
			/>
			<Table dataSource={raucuquas} columns={columns} />
		</>
  )
}

export default RauCuQua