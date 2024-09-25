
import { AvatarComponent, HeadComponent } from '@/components';
import CategoryNNDTComponent from '@/components/CategoryNNDTComponent';
import { fs } from '@/firebase/firebaseConfig';
import { NNDTModel } from '@/models/NNDTModel';
import { HandleFile } from '@/utils/handleFile';
import { Button, Modal, Space, Tag, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiTrash } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { FcAddImage } from 'react-icons/fc';

const { confirm } = Modal;

const ProductsNNDT = () => {
    const [productsnndt, setProductsNNDT] = useState<NNDTModel[]>([]);

    const router = useRouter();

	useEffect(() => {
		onSnapshot(collection(fs, 'nndt'), (snap) => {
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

				setProductsNNDT(items);
			}
		});
	}, []);



	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: NNDTModel) => (
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
			dataIndex: 'categoriesnndt',
			render: (ids: string) =>
				ids &&
				ids.length > 0 && (
					<Space>
						{/* {ids.map((id) => ( */}
							<Tag>
								<CategoryNNDTComponent id={ids} key={ids} />
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
								router.push(`/nndt/add-new-nndt?id=${item.id}`)
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
			render: (item: NNDTModel) => (
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

	const handleDeletOffer = async (item: NNDTModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `nndt/${item.id}`));
	};
  return (
    <div>
        <HeadComponent
			title='SẢN PHẨM'
			pageTitle='SẢN PHẨM'
			extra={
				<Button
						type='primary'
						onClick={() => router.push('/nndt/add-new-nndt')}>
						THÊM MỚI
				</Button>
			}
		/>
		<Table dataSource={productsnndt} columns={columns} />
    </div>
  )
}

export default ProductsNNDT