import { Button } from 'antd'
import React, { useRef } from 'react'
import { BiUpload } from 'react-icons/bi'


interface Props {
    onSelected : (files :  any) => void
    multible ?: boolean
    accept ?: ''
    loading ?: boolean
}
const ImagePicker = (props : Props) => {

    const {onSelected, multible, accept, loading} = props 
    const fileRef = useRef<any>(null)
  return (
    <>
        <Button loading={loading} className='mt-4' onClick={() => {
            if (fileRef.current) {
                fileRef.current?.click();
            }
        }} icon={<BiUpload size={18}/>}>Tải lên</Button>
        <div className='d-none'>
            <input 
                type='file'
                ref={fileRef}
                multiple={multible} 
                accept={accept ?? 'image/*'}
                onChange={val => onSelected(val.target.files)}
                name=''
                id=''
            />
        </div>
    </>
  )
  
}

export default ImagePicker