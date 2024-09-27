
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Modal, Space, Tooltip } from 'antd'
import { useRouter } from 'next/router';
import { BSCTModel } from '@/models/BSCTModel';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import Table, { ColumnProps } from 'antd/es/table';
import { FaEdit } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';


const { confirm } = Modal;
const BacSiCayTrong = () => {
    const router = useRouter();
	const [bsct, setBSCT] = useState<BSCTModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'bsct'), (snap) => {
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

				setBSCT(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: BSCTModel) => (
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
								router.push(`/bsct/add-new-bsct?id=${item.id}`)
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
			render: (item: BSCTModel) => (
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

	const handleDeleteHuongDanKT = async (item: BSCTModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `bsct/${item.id}`));
	};
  return (
		<>
			<HeadComponent
				title='BÁC SĨ CÂY TRỒNG'
				pageTitle='BÁC SĨ CÂY TRỒNG'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/bsct/add-new-bsct')}>
						Thêm mới
					</Button>
				}
			/>
			<Table dataSource={bsct} columns={columns} />
		</>
  )
}

export default BacSiCayTrong