import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { HeadComponent } from '@/components';
import { Button } from 'antd';
import { AddNewCategory } from '@/modals';

const Categories = () => {
  const [isVisibleModalAddCategory, setIsVisibleModalAddCategory] = useState(false);
  return <div>
    <HeadComponent 
      title='Categories' 
      pageTitle='Categories' 
      extra={<Button type='primary' onClick={() => setIsVisibleModalAddCategory(true)}>TẠO MỚI</Button>}
    />
    <AddNewCategory visible={isVisibleModalAddCategory} onClose={() => setIsVisibleModalAddCategory(false)} />
  </div>
}

export default Categories;