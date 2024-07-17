import { View, Text } from 'react-native'
import React from 'react'
import { HeadComponent } from '@/components'

const TinTucSPC = () => {
  return (
        <>
			<HeadComponent
				title='TIN TỨC SPC'
				pageTitle='TIN TỨC SPC'
				// extra={
				// 	<Button
				// 		type='primary'
				// 		onClick={() => router.push('/rongrieu/add-new-ctgd-rongrieu')}>
				// 		Add new
				// 	</Button>
				// }
			/>
			{/* <Table dataSource={rongrieu} columns={columns} /> */}
		</>
  )
}

export default TinTucSPC