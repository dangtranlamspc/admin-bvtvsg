import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Space, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { TinTucSuKienModel } from '@/models/TinTucSuKienModel';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { fs } from '@/firebase/firebaseConfig';
import Table, { ColumnProps } from 'antd/es/table';
import { AvatarComponent, HeadComponent } from '@/components';
import { FaEdit } from 'react-icons/fa';
import { BiTrash } from 'react-icons/bi';
import { HandleFile } from '@/utils/handleFile';

const { confirm } = Modal;
const TinTucSuKien = () => {
  const router = useRouter();
	const [tintucsukien, setTinTucSuKien] = useState<TinTucSuKienModel[]>([]);
  useEffect(() => {
    onSnapshot(collection(fs, 'tintucsukien'), (snap) => {
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

        setTinTucSuKien(items);
      }
    });
  }, []);

  const columns : ColumnProps<any>[] = [
    {
      key: 'image',
      title: '',
      dataIndex: '',
      render: (item: TinTucSuKienModel) => (
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
      title: 'TIÊU ĐỀ',
    },
    {
      key: 'youtubeId',
      dataIndex: 'youtubeId',
      title: 'Youtube ID',
    },
    {
      title: '',
      align: 'right',
      dataIndex: '',
      render: (item) => (
        <Space>
          <Tooltip title='Chỉnh sửa tin tức'>
            <Button
              type='text'
              icon={<FaEdit color='#676767' size={20} />}
              onClick={() =>
                router.push(`/tintucsukien/add-new-tintucsukien?id=${item.id}`)
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
      render: (item: TinTucSuKienModel) => (
        <Space>
          <Button
            onClick={() =>
              confirm({
                title: 'Confirm',
                content: 'Delete ?',
                onOk: () => handleDeleteTinTucSuKien(item),
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

  const handleDeleteTinTucSuKien = async (item: TinTucSuKienModel) => {
    if (item.files && item.files.length > 0) {
      item.files.forEach(async (fileId) => await HandleFile.removeFile(fileId));
    }

    await deleteDoc(doc(fs, `tintucsukien/${item.id}`));
  };
  return (
    <>
			<HeadComponent
				title='TIN TỨC SỰ KIỆN'
				pageTitle='TIN TỨC SỰ KIỆN'
				extra={
					<Button
						type='primary'
						onClick={() => router.push('/tintucsukien/add-new-tintucsukien')}>
						Thêm mới
					</Button>
				}
			/>
			<Table dataSource={tintucsukien} columns={columns} />
		</>
  )
}

export default TinTucSuKien