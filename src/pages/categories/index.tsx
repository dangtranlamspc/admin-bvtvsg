
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components';
import { Button , Modal, Space, Table, Tooltip } from 'antd';
import { AddNewCategory } from '@/modals';
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { CategoryModel } from '@/models/CategoryModel';
import { ColumnProps } from 'antd/es/table';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';
import { FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { FcAddImage } from 'react-icons/fc';

const { confirm } = Modal;

const Categories = () => {
  const [isVisibleModalAddCategory, setIsVisibleModalAddCategory] = useState(false);

  const [categories, setCategories] = useState<CategoryModel[]> ([]);

  const router = useRouter();

  useEffect (() => {
    onSnapshot(collection(fs, 'categories'), (snap) => {
      if(snap.empty) {
        console.log('Không tìm thấy dữ liệu')
        setCategories([])
      }else{
        const items : CategoryModel[] = [];
        snap.forEach((item: any) => {
          items.push({
            id: item.id,
            ...item.data()
          })
        })
        setCategories(items)
      }
    })
  })

  // const handleUpdate = async () => {
  //   if (categories.length > 0) {
  //     categories.forEach( async (cat) => {
  //       if (cat.files && cat.files.length > 0 ) {
  //         const fileId = cat.files[0];

  //         const snap = await getDoc(doc(fs, `files/${fileId}`))
  //         if (snap.exists()) {
  //           const data = (snap.data());
  //           await updateDoc(doc(fs, `categories/${cat.id}`) , {
  //             imageURL : data.downloadURL,
  //           })
  //           console.log('DOne')
  //         }
  //       }
  //     })
  //   }
  // }

  const columns : ColumnProps<any>[] = [
		{
			key: 'img',
			dataIndex: '',
			render: (item: CategoryModel) => (
				<AvatarComponent
					imageUrl={item.imageUrl}
					id={item.files && item.files.length > 0 ? item.files[0] : undefined}
					path='files'
				/>
			),
		},
		{
			key: 'title',
			dataIndex: 'title',
		},
		{
			title: '',
			align: 'right',
			dataIndex: '',
			render: (item : CategoryModel) => (
				<Space>
					<Tooltip title='Chỉnh sửa'>
						<Button
							type='text'
							icon={<FaEdit color='#676767' size={20} />}
							onClick={() =>
								router.push(`/categories/add-new-categories?id=${item.id}`)
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
			render: (item: CategoryModel) => (
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
  	];

  const handleDeletOffer = async (item: CategoryModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `categories/${item.id}`));
	};

  return (
    <div>
			<HeadComponent
				title='DANH MỤC'
				pageTitle='DANH MỤC'
				extra={
					<Button
						type='primary'
						onClick={() => setIsVisibleModalAddCategory(true)}>
						THÊM MỚI
					</Button>
				}
			/>
      {/* <Button onClick={handleUpdate}>Cập nhật</Button> */}

			<Table dataSource={categories} columns={columns} />
			<AddNewCategory
				visible={isVisibleModalAddCategory}
				onClose={() => setIsVisibleModalAddCategory(false)}
			/>
		</div>
  )



  // return <div>
  //   <HeadComponent 
  //     title='Categories' 
  //     pageTitle='Categories' 
  //     extra={<Button type='primary' onClick={() => setIsVisibleModalAddCategory(true)}>TẠO MỚI</Button>}
  //   />
  //   <AddNewCategory visible={isVisibleModalAddCategory} onClose={() => setIsVisibleModalAddCategory(false)} />
  // </div>
}

export default Categories;