import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Space, Tag, Table, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { ProductModel } from '@/models/ProductModel'
import { collection, onSnapshot } from 'firebase/firestore'
import { fs } from '@/firebase/firebaseConfig'
import { ColumnProps } from 'antd/es/table'
import CategoryComponent from '@/components/CategoryComponent'
import { FaEdit } from 'react-icons/fa'

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
			// render: (ids: string[]) =>
			// 	ids &&
			// 	ids.length > 0 && (
			// 		<Space>
			// 			{ids.map((id) => (
			// 				<Tag>
			// 					<CategoryComponent id={id} key={id} />
			// 				</Tag>
			// 			))}
			// 		</Space>
			// ),
		},
		{
			key: 'Price',
			title: 'GIÁ',
			dataIndex: 'price',
		},
		{
			title: '',
			align: 'right',
			dataIndex: '',
			render: (item) => (
				<Space>
					<Tooltip title='Edit product'>
						<Button
							type='text'
							icon={<FaEdit color='#676767' size={20} />}
							onClick={() =>
								router.push(`/products/add-new-product?id=${item.id}`)
							}
						/>
					</Tooltip>
					{/* <Tooltip title='Add sub product'>
						<Button
							type='text'
							icon={<FcAddImage size={22} />}
							onClick={() =>
								router.push(`/products/add-sub-product?id=${item.id}`)
							}
						/>
					</Tooltip> */}
				</Space>
			),
		},
	]

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