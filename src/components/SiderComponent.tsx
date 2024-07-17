import { SettingOutlined } from '@ant-design/icons';
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
      {
        key: 'sub4',
        label: 'NÔNG NGHIỆP ĐÔ THỊ',
        icon: <AiFillProduct />,
        children: [
          { key: 'hoacaykieng', label: <Link href={'/hoacaykieng'}>HOA - CÂY KIỂNG</Link> },
          { key: 'raucuqua', label: <Link href={'/raucuqua'}>RAU - CỦ -QUẢ</Link> },
        ],
      },
      {
        key: 'sub5',
        label: 'CÔN TRÙNG GIA DỤNG',
        icon: <AiFillProduct />,
        children: [
          { key: 'nhavuons', label: <Link href={'/nhavuons'}>CÔN TRÙNG TRONG NHÀ - VƯỜN</Link> },
          { key: 'rongrieu', label: <Link href={'/rongrieu'}>RONG RÊU - SINH VẬY THỦY CẢNH</Link> },
        ],
      },
      {
        key: 'sub6',
        label: 'TIN TỨC',
        icon: <AiFillProduct />,
        children: [
          { key: 'tintucspc', label: <Link href={'/tintucspc'}>TIN TỨC SPC</Link> },
          { key: 'hoichosukien', label: <Link href={'/hoichosukien'}>HỘI CHỢ - SỰ KIỆN</Link> },
          { key: 'hoatdongtapthe', label: <Link href={'/hoatdongtapthe'}>HOẠT ĐỘNG TẬP THỂ</Link> },
          { key: 'bieuduongkhenthuong', label: <Link href={'/bieuduongkhenthuong'}>BIỂU DƯƠNG - KHEN THƯỞNG</Link> },
        ],
      },
    ]
  return (
    <Sider style={{height: '100vh'}}>
        <Menu style={{width: 250}} items={items} theme='dark' />
    </Sider>
  )
}

export default SiderComponent