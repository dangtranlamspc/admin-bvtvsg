import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import {fs} from '@/firebase/firebaseConfig'
import { collectionNames } from '@/constants/collectionNames'
import { UserModel } from '@/models/UserModel'
import { ColumnProps } from 'antd/es/table'
import {Button, Space, Table} from 'antd'
import { BiTrash } from 'react-icons/bi'
import { HeadComponent } from '@/components'
const Users = () => {

  const [users, setUsers] = useState<UserModel[]>([])

  useEffect (() => {
    onSnapshot(collection(fs, collectionNames.users), snap => {
      if (snap.empty) {
        console.log('Data not found')
      }else{
        const items : any = []
        snap.forEach((item:any) => items.push({
          id : item.id,
          ...item.data()
        }))
        setUsers(items);
      }
    })
  }, []);

  const colums: ColumnProps<UserModel>[] = [
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
      render : (item: UserModel) => <Space>
        <Button icon={<BiTrash size={20}/>} danger type='text' />
      </Space>,
      align: 'right'
    },
  ]
  return (
      <div>
        <HeadComponent
				title='NGƯỜI DÙNG'
				pageTitle='NGƯỜI DÙNG'
			/>
          <Table dataSource={users} columns={colums}>
      
          </Table>
      </div>
  )
}

export default Users