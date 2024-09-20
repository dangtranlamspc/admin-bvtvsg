import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Space, Table } from 'antd';
import { CategoryBSCTModel } from '@/models/CategoryBSCTModel';
import { collection, deleteDoc, doc, onSnapshot, orderBy } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import { ColumnProps } from 'antd/es/table';
import { AvatarComponent, HeadComponent } from '@/components';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';
import { AddNewCategoryBSCT } from '@/modals';

const { confirm } = Modal;

const CategoriesBSCT = () => {

    const [isVisibleModalAddCategory, setIsVisibleModalAddCategory] = useState(false);

    const [categoriesbsct, setCategoriesBSCT] = useState<CategoryBSCTModel[]> ([]);


    useEffect (() => {
        onSnapshot(collection(fs, 'categoriesbsct'), (snap) => {
          if(snap.empty) {
            console.log('Không tìm thấy dữ liệu')
            setCategoriesBSCT([])
          }else{
            const items : CategoryBSCTModel[] = [];
            snap.forEach((item: any) => {
              items.push({
                id: item.id,
                ...item.data()
              })
            })
            setCategoriesBSCT(items)
          }
        })
      })

      const columns : ColumnProps<any>[] = [
		{
			key: 'img',
			dataIndex: '',
			render: (item: CategoryBSCTModel) => (
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
			key: 'btn',
			title: '',
			dataIndex: '',
			render: (item: CategoryBSCTModel) => (
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

  const handleDeletOffer = async (item: CategoryBSCTModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `categoriesbsct/${item.id}`));
	};
  return (
    <div>
			<HeadComponent
				title='DANH MỤC BÁC SĨ CÂY TRỒNG'
				pageTitle='DANH MỤC BÁC SĨ CÂY TRỒNG'
				extra={
					<Button
						type='primary'
						onClick={() => setIsVisibleModalAddCategory(true)}>
						THÊM MỚI
					</Button>
				}
			/>
      {/* <Button onClick={handleUpdate}>Cập nhật</Button> */}

			<Table dataSource={categoriesbsct} columns={columns} />
			<AddNewCategoryBSCT
				visible={isVisibleModalAddCategory}
				onClose={() => setIsVisibleModalAddCategory(false)}
			/>
		</div>
  )
}

export default CategoriesBSCT