
import { AvatarComponent, HeadComponent } from '@/components';
import CategoryCTGDComponent from '@/components/CategoryCTGDComponent';
import { fs } from '@/firebase/firebaseConfig';
import { CTGDModel } from '@/models/CTGDModel';
import { HandleFile } from '@/utils/handleFile';
import { Button, Modal, Space, Tag, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiTrash } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';

const { confirm } = Modal;

const ProductsCTGD = () => {
    const [productsctgd, setProductsCTGD] = useState<CTGDModel[]>([]);

    const router = useRouter();

	useEffect(() => {
		onSnapshot(collection(fs, 'ctgd'), (snap) => {
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

				setProductsCTGD(items);
			}
		});
	}, []);



	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: CTGDModel) => (
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
			key: 'catnndt',
			title: 'Categories',
			dataIndex: 'categoriesctgd',
			render: (ids: string) =>
				ids &&
				ids.length > 0 && (
					<Space>
						{/* {ids.map((id) => ( */}
							<Tag>
								<CategoryCTGDComponent id={ids} key={ids} />
							</Tag>
						{/* ))} */}
					</Space>
			),

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
								router.push(`/ctgd/add-new-ctgd?id=${item.id}`)
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
			render: (item: CTGDModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Bạn muốn xóa sản phẩm?',
								onOk: () => handleDeletOffer(item),
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

	const handleDeletOffer = async (item: CTGDModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `ctgd/${item.id}`));
	};
  return (
    <div>
        <HeadComponent
			title='SẢN PHẨM'
			pageTitle='SẢN PHẨM'
			extra={
				<Button
						type='primary'
						onClick={() => router.push('/ctgd/add-new-ctgd')}>
						THÊM MỚI
				</Button>
			}
		/>
		<Table dataSource={productsctgd} columns={columns} />
    </div>
  )
}

export default ProductsCTGD