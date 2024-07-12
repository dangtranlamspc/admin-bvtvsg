import { useEffect, useState } from 'react'
import { HeadComponent } from '@/components'
import AvatarComponent from '@/components/AvatarComponent';
import { Button, Space, Tag, Table, Tooltip, Modal } from 'antd'
import { useRouter } from 'next/router'
import { ProductModel } from '@/models/ProductModel'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { fs } from '@/firebase/firebaseConfig'
import { ColumnProps } from 'antd/es/table'
import CategoryComponent from '@/components/CategoryComponent'
import { FaEdit } from 'react-icons/fa'
import { FcAddImage } from 'react-icons/fc';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';

const { confirm } = Modal;

const Products = () => {

	const [products, setProducts] = useState<ProductModel[]>([]);

    const router = useRouter();

	useEffect(() => {
		onSnapshot(collection(fs, 'products'), (snap) => {
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

				setProducts(items);
			}
		});
	}, []);

	const columns : ColumnProps<any>[] = [
		{
			key: 'image',
			title: '',
			dataIndex: '',
			render: (item: ProductModel) => (
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
			key: 'cat',
			title: 'Categories',
			dataIndex: 'categories',
			render: (ids: string) =>
				ids &&
				ids.length > 0 && (
					<Space>
						{/* {ids.map((id) => ( */}
							<Tag>
								<CategoryComponent id={ids} key={ids} />
							</Tag>
						{/* ))} */}
					</Space>
			),

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
								router.push(`/products/add-new-product?id=${item.id}`)
							}
						/>
					</Tooltip>
					<Tooltip title='Thêm thuộc tính'>
						<Button
							type='text'
							icon={<FcAddImage size={22} />}
							onClick={() =>
								router.push(`/products/add-sub-product?id=${item.id}`)
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
			render: (item: ProductModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete offer?',
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

	const handleDeletOffer = async (item: ProductModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `products/${item.id}`));
	};

  return (
    <div>
        <HeadComponent
			title='SẢN PHẨM'
			pageTitle='SẢN PHẨM'
			extra={
				<Button
						type='primary'
						onClick={() => router.push('/products/add-new-product')}>
						THÊM MỚI
				</Button>
			}
		/>
		<Table dataSource={products} columns={columns} />
    </div>
  )
}

export default Products