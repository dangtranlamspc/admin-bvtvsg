import { collectionNames } from '@/constants/collectionNames';
import { fs } from '@/firebase/firebaseConfig';
import { OfferModel } from '@/models/OfferModel';
import { Button, Space } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BiTrash } from 'react-icons/bi';

const Offers = () => {
    const router = useRouter()

  useEffect (() => {
    onSnapshot(collection(fs, collectionNames.offers), snap => {
      if (snap.empty) {
        console.log('Data not found')
      }else{
        const items : any = []
        snap.forEach((item:any) => items.push({
          id : item.id,
          ...item.data()
        }))
        console.log(items);
      }
    })
  }, []);

  const colums: ColumnProps<OfferModel>[] = [
    {
      key : 'Name',
      dataIndex: 'displayName',
      title: 'TÀI KHOẢN',
    },
    {
      key : 'email',
      dataIndex: 'email',
      title: 'EMAIL'
    },
    {
      key : 'createdAt',
      dataIndex: 'creationTime',
      title: 'THỜI GIAN TẠO TÀI KHOẢN',
      render :(val: Date) => new Date(val).toISOString(),
      align: 'center'
    },
    {
      key : 'btn',
      title : '',
      dataIndex : '',
      render : (item: OfferModel) => <Space>
        <Button icon={<BiTrash size={20}/>} danger type='text' />
      </Space>,
      align: 'right'
    },
  ]

  return <>
            <div className='text-right'>
                <Button type='primary' onClick={() => router.push('/offers/add-new-offer')}>Add New</Button>
            </div>
        </>

}

export default Offers;