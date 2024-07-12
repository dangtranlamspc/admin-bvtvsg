import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components';
import { Button , Space, Table } from 'antd';
import { AddNewCategory } from '@/modals';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { CategoryModel } from '@/models/CategoryModel';
import { ColumnProps } from 'antd/es/table';

const Categories = () => {
  const [isVisibleModalAddCategory, setIsVisibleModalAddCategory] = useState(false);

  const [categories, setCategories] = useState<CategoryModel[]> ([]);

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

  const columns : ColumnProps<CategoryModel>[] = [
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

  ]

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