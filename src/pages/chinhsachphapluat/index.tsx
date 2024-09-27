
import React, { useEffect, useState } from 'react'
import { Button, Modal, Space, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { CSPLModel } from '@/models/CSPLModel';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import Table, { ColumnProps } from 'antd/es/table';
import { AvatarComponent, HeadComponent } from '@/components';
import { FaEdit } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';


const { confirm } = Modal;
const ChinhSachPhapLuat = () => {
    const router = useRouter();
	const [chinhsachphapluat, setChinhSachPhapLuat] = useState<CSPLModel[]>([]);

	useEffect(() => {
		onSnapshot(collection(fs, 'chinhsachphapluat'), (snap) => {
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

			    setChinhSachPhapLuat(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: CSPLModel) => (
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
					<Tooltip title='Chỉnh sửa chính sách'>
						<Button
							type='text'
							icon={<FaEdit color='#676767' size={20} />}
							onClick={() =>
								router.push(`/chinhsachphapluat/add-new-cspl?id=${item.id}`)
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
			render: (item: CSPLModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete ?',
								onOk: () => handleDeleteChinhSachPhapLuat(item),
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

	const handleDeleteChinhSachPhapLuat = async (item: CSPLModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `chinhsachphapluat/${item.id}`));
	};
  return (
        <>
			<HeadComponent
				title='CHÍNH SÁCH PHÁP LUẬT'
				pageTitle='CHÍNH SÁCH PHÁP LUẬT'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/chinhsachphapluat/add-new-cspl')}>
						Thêm mới
					</Button>
				}
			/>
			<Table dataSource={chinhsachphapluat} columns={columns} />
		</>
  )
}

export default ChinhSachPhapLuat