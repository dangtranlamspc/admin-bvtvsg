
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Modal, Space, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { TTNNModel } from '@/models/TTNNModel';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import Table, { ColumnProps } from 'antd/es/table';
import { FaEdit } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';

const { confirm } = Modal;
const TinTucNongNghiep = () => {

    const router = useRouter();
	const [tintucnongnghiep, setTinTucNongNghiep] = useState<TTNNModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'tintucnongnghiep'), (snap) => {
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

				setTinTucNongNghiep(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: TTNNModel) => (
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
					<Tooltip title='Chỉnh sửa thông tin'>
						<Button
							type='text'
							icon={<FaEdit color='#676767' size={20} />}
							onClick={() =>
								router.push(`/tintucnongnghiep/add-new-ttnn?id=${item.id}`)
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
			render: (item: TTNNModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete ?',
								onOk: () => handleDeleteTinTucNongNghiep(item),
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

	const handleDeleteTinTucNongNghiep = async (item: TTNNModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `tintucnongnghiep/${item.id}`));
	};
  return (
        <>
			<HeadComponent
				title='TIN TỨC NÔNG NGHIỆP'
				pageTitle='TIN TỨC NGHIỆP'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/tintucnongnghiep/add-new-ttnn')}>
						Thêm mới
					</Button>
				}
			/>
			<Table dataSource={tintucnongnghiep} columns={columns} />
		</>
  )
}

export default TinTucNongNghiep