
import { AvatarComponent, HeadComponent } from '@/components';
import { fs } from '@/firebase/firebaseConfig';
import AddNewCategoryCTGD from '@/modals/AddNewCategoryCTGD';
import { CategoryCTGDModel } from '@/models/CategoryCTGDModel';
import { HandleFile } from '@/utils/handleFile';
import { Button, Modal, Space } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { onSnapshot, collection, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { BiTrash } from 'react-icons/bi';

const { confirm } = Modal;

const CategoryCTGD = () => {
    const [isVisibleModalAddCategory, setIsVisibleModalAddCategory] = useState(false);

    const [categoriesctgd, setCategoriesCTGD] = useState<CategoryCTGDModel[]> ([]);


    useEffect (() => {
        onSnapshot(collection(fs, 'categoriesctgd'), (snap) => {
          if(snap.empty) {
            console.log('Không tìm thấy dữ liệu')
            setCategoriesCTGD([])
          }else{
            const items : CategoryCTGDModel[] = [];
            snap.forEach((item: any) => {
              items.push({
                id: item.id,
                ...item.data()
              })
            })
            setCategoriesCTGD(items)
          }
        })
      })

      const columns : ColumnProps<any>[] = [
		{
			key: 'img',
			dataIndex: '',
			render: (item: CategoryCTGDModel) => (
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
			render: (item: CategoryCTGDModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete?',
								onOk: () => handleDeleteCategoryNNDT(item),
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

  const handleDeleteCategoryNNDT = async (item: CategoryCTGDModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `categoriesctgd/${item.id}`));
	};
  return (
    <div>
        <HeadComponent
            title='DANH MỤC CÔN TRÙNG GIA DỤNG'
            pageTitle='DANH MỤC CÔN TRÙNG GIA DỤNG'
            extra={
                <Button
                    type='primary'
                    onClick={() => setIsVisibleModalAddCategory(true)}>
                    THÊM MỚI
                </Button>
            }
        />
        <Table dataSource={categoriesctgd} columns={columns} />
        <AddNewCategoryCTGD
            visible={isVisibleModalAddCategory}
            onClose={() => setIsVisibleModalAddCategory(false)}
        />
    </div>
  )
}

export default CategoryCTGD