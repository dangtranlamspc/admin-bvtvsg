import { generatorRandomText } from '@/utils/generatorRandomText';
import { Button, Card, Form, Input } from 'antd'
import React, { useEffect } from 'react'

const AddNewOffer = () => {
    const [form] = Form.useForm();
    const addNewOffer = async(values : any) => {
        console.log(values)
    }
    useEffect (()=> {
        const str  = generatorRandomText()
        form.setFieldValue('code' , str)
    })
  return (
    <div className='col-md-8 offet-md-2'>
        <Card>
            <Form layout='vertical' form={form} onFinish={addNewOffer}>
                <Form.Item name={'title'} label='Title' rules={[
                    {
                        required : true,
                        message: 'Please enter title or offer'
                    }
                ]}>
                    <Input placeholder='title' allowClear/>
                </Form.Item>
                <Form.Item name={'description'} label='Description' >
                    <Input.TextArea rows={2} placeholder='Description' allowClear/>
                </Form.Item>
                <Form.Item name={'code'} label='Code' > 
                    <Input disabled placeholder='Code' readOnly/>
                </Form.Item>
            </Form>
            <div className='text-right'>
                <Button type='primary' onClick={() => form.submit()} >Publish</Button>
            </div>
        </Card>
    </div>
  )
}

export default AddNewOffer