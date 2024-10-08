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
        label : <Link href={'/offers'}>Slider trang chủ</Link>,
        icon : <FaPercentage/>
      },
      {
        key: 'sub3',
        label: 'SẢN PHẨM',
        icon: <AiFillProduct />,
        children: [
          { key: 'categories', label: <Link href={'/categories'}>DANH MỤC SẢN PHẨM</Link> },
          { key: 'hoichosukien', label: <Link href={'/products'}>DANH SÁCH SẢN PHẨM</Link> },
        ],
      },
      {
        key: 'sub4',
        label: 'BÁC SĨ CÂY TRỒNG',
        icon: <AiFillProduct />,
        children: [
          { key: 'danhmucbsct', label: <Link href={'/danhmucbsct'}>DANH MỤC BSCT</Link> },
          { key: 'bsct', label: <Link href={'/bsct'}>DANH SÁCH BSCT</Link> },
        ],
      },
      {
        key: 'sub8',
        label: 'NÔNG NGHIỆP ĐÔ THỊ',
        icon: <AiFillProduct />,
        children: [
          { key: 'danhmucnndt', label: <Link href={'/danhmucnndt'}>DANH MỤC</Link> },
          { key: 'nndt', label: <Link href={'/nndt'}>DANH SÁCH</Link> },
        ],
      },
      {
        key: 'sub5',
        label: 'CÔN TRÙNG GIA DỤNG',
        icon: <AiFillProduct />,
        children: [
          { key: 'danhmucctgd', label: <Link href={'/danhmucctgd'}>DANH MỤC</Link> },
          { key: 'ctgd', label: <Link href={'/ctgd'}>DANH SÁCH SẢN PHẨM</Link> },
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
      {
        key: 'sub7',
        label: 'TIN NÔNG NGHIỆP',
        icon: <AiFillProduct />,
        children: [
          { key: 'tintucnongnghiep', label: <Link href={'/tintucnongnghiep'}>TIN TỨC NÔNG NGHIỆP</Link> },
          { key: 'chinhsachphapluat', label: <Link href={'/chinhsachphapluat'}>CHÍNH SÁCH PHÁP LUẬT</Link> },
        ],
      },
      {
        key: 'sub9',
        label: 'THƯ VIỆN',
        icon: <AiFillProduct />,
        children: [
          { key: 'tailieukithuat', label: <Link href={'/tailieukithuat'}>TÀI LIỆU KĨ THUẬT</Link> },
          { key: '', label: <Link href={'/'}>CUỘC BẠN THỬ LÀM BSCT NĂM 2023</Link> },
          { key: '', label: <Link href={'/'}>CUỘC BẠN THỬ LÀM BSCT NĂM 2021</Link> },
          { key: 'tintucsukien', label: <Link href={'/tintucsukien'}>TIN TỨC - SỰ KIỆN</Link> },
          { key: '', label: <Link href={'/'}>MEDIA</Link> },
        ],
      },
      {
        key : 'sliders',
        label : <Link href={'/sliders'}>SLIDERS TRANG CHỦ</Link>,
        icon : <AiFillProduct />
      },
    ]
  return (
    <Sider style={{height: '100vh'}} width={250}>
        <Menu items={items} theme='dark' />
    </Sider>
  )
}

export default SiderComponent