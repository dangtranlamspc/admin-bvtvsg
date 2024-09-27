
import React, { useEffect, useState } from 'react'
import { AvatarComponent, HeadComponent } from '@/components'
import { Button, Modal, Space, Table } from 'antd'
import { useRouter } from 'next/router'
import { SlidersModel } from '@/models/SliderModel'
import { ColumnProps } from 'antd/es/table'
import { HandleFile } from '@/utils/handleFile'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { fs } from '@/firebase/firebaseConfig'
import { BiTrash } from 'react-icons/bi'
import { collectionNames } from '@/constants/collectionNames'



const { confirm } = Modal;
const SliderHome = () => {
    const [sliders, setSliders] = useState<SlidersModel[]>([]);
    const router = useRouter();

    useEffect (() => {
        onSnapshot(collection(fs, collectionNames.sliders), (snap) => {
            if (snap.empty) {
                console.log('Không tìm thấy dữ liệu');

            }else{
                const items : any[] = [];
                snap.forEach((item: any) => 
                    items.push({
                        id : item.id,
                        ...item.data()
                    })
                )

                setSliders(items);
            }
        })
    })


    const columns: ColumnProps<any>[] = [
		{
			key: 'avatar',
			dataIndex: '',
			title: 'HÌNH ẢNH',
			render: (item: SlidersModel) => (
				<AvatarComponent
					imageUrl={item.imageUrl}
					id={item.files && item.files.length > 0 ? item.files[0] : ''}
					path='files'
				/>
			),
		},
		{
			key: 'Title',
			dataIndex: 'title',
			title: 'TIÊU ĐỀ',
		},

		{
			key: 'btn',
			title: '',
			dataIndex: '',
			render: (item: SlidersModel) => (
				<Space>
					<Button
						onClick={() =>
							confirm({
								title: 'Confirm',
								content: 'Delete slider?',
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

    const handleDeletOffer = async (item: SlidersModel) => {
		if (item.files && item.files.length > 0) {
			item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
		}

		await deleteDoc(doc(fs, `sliders/${item.id}`));
	};


  return (
    <>
		<HeadComponent
			title='SLIDER'
			pageTitle='SLIDER'
			extra={
				<Button
					type='primary'
					onClick={() => router.push('/sliders/add-new-slider')}>
					Thêm mới
				</Button>
			}
		/>
		{/* <Button onClick={handleUpdate}>Update</Button> */}
		<Table dataSource={sliders} columns={columns} />
	</>
  )
}

export default SliderHome