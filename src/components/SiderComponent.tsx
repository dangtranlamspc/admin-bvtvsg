import { Layout, Menu, MenuProps } from 'antd'
import Link from 'next/link';
import React from 'react'
import { AiFillProduct } from 'react-icons/ai';
import { BiHome, BiUser } from 'react-icons/bi';
import { FaPercentage } from 'react-icons/fa';
import { IoMdPricetag } from 'react-icons/io';


type MenuItem = Required<MenuProps>['items'] [number]
const {Sider} = Layout;
const SiderComponent = () => {
    const items : MenuItem [] = [
        {
          key : 'home',
          label : <Link href={'/'}>TRANG CHỦ</Link>,
          icon : <BiHome/>
        },
        {
          key : 'users',
          label : <Link href={'/users'}>NGƯỜI DÙNG</Link>,
          icon : <BiUser/>
      },
      {
        key : 'offers',
        label : <Link href={'/offers'}>KHUYẾN MÃI</Link>,
        icon : <FaPercentage/>
      },
      {
        key : 'categories',
        label : <Link href={'/categories'}>DANH MỤC</Link>,
        icon : <IoMdPricetag />
      },
      {
        key : 'products',
        label : <Link href={'/products'}>SẢN PHẨM</Link>,
        icon : <AiFillProduct />
      },
    ]
  return (
    <Sider style={{height: '100vh'}}>
        <Menu items={items} theme='dark' />
    </Sider>
  )
}

export default SiderComponent