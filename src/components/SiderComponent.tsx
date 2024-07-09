import { Layout, Menu, MenuProps } from 'antd'
import Link from 'next/link';
import React from 'react'
import { BiHome, BiUser } from 'react-icons/bi';


type MenuItem = Required<MenuProps>['items'] [number]
const {Sider} = Layout;
const SiderComponent = () => {
    const items : MenuItem [] = [
        {
          key : 'home',
          label : <Link href={'/'}>Home</Link>,
          icon : <BiHome/>
        },
        {
          key : 'users',
          label : <Link href={'/users'}>User</Link>,
          icon : <BiUser/>
      },
      {
        key : 'offers',
        label : <Link href={'/offers'}>Offer</Link>,
        icon : <BiUser/>
      },
    ]
  return (
    <Sider style={{height: '100vh'}}>
        <Menu items={items} theme='dark' />
    </Sider>
  )
}

export default SiderComponent