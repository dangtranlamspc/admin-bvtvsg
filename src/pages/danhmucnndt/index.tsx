import { AvatarComponent, HeadComponent } from "@/components";
import { fs } from "@/firebase/firebaseConfig";
import { CategoryNNDTModel } from "@/models/CategoryNNDTModel";
import { Button, Modal, Space } from "antd";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import Table, { ColumnProps } from 'antd/es/table';
import { HandleFile } from "@/utils/handleFile";
import AddNewCategoryNNDT from "@/modals/AddNewCategoryNNDT";

const { confirm } = Modal;

const CategoriesNNTD = () => {
    const [isVisibleModalAddCategory, setIsVisibleModalAddCategory] = useState(false);

    const [categoriesbsct, setCategoriesBSCT] = useState<CategoryNNDTModel[]> ([]);


    useEffect (() => {
        onSnapshot(collection(fs, 'categoriesnndt'), (snap) => {
          if(snap.empty) {
            console.log('Không tìm thấy dữ liệu')
            setCategoriesBSCT([])
          }else{
            const items : CategoryNNDTModel[] = [];
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
			render: (item: CategoryNNDTModel) => (
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
			render: (item: CategoryNNDTModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete offer?',
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

  const handleDeleteCategoryNNDT = async (item: CategoryNNDTModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `categoriesnndt/${item.id}`));
	};
    return (
        <div>
			<HeadComponent
				title='DANH MỤC NÔNG NGHIỆP ĐÔ THỊ'
				pageTitle='DANH MỤC NÔNG NGHIỆP ĐÔ THỊ'
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
			<AddNewCategoryNNDT
				visible={isVisibleModalAddCategory}
				onClose={() => setIsVisibleModalAddCategory(false)}
			/>
		</div>
    )
}
export default CategoriesNNTD