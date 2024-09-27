
import React, { useState } from 'react'
import { Input, message, Modal } from 'antd'
import { addDoc, collection } from 'firebase/firestore'
import { fs } from '@/firebase/firebaseConfig'
import { HandleFile } from '@/utils/handleFile'
import { ImagePicker } from '@/components'


type Props = {
  visible : boolean,
  onClose : () => void
}
const AddNewCategoryBSCT = (props : Props) => {

  const {visible, onClose} = props

    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('')

    const [files, setFiles] = useState<any[]>([])

    const handleClose = () => {
        setTitle('')
        setFiles([])
        onClose();
    };

    const handleAddNewCatrgoryBSCT = async (values: any) => {
        if (!title) {
            message.error('Không tìm thấy danh mục')
        }else if (files.length === 0){
            message.error('Không tìm thấy hình ảnh')
        }else{
            setIsLoading(true)

            try{
                const snap = await addDoc(collection(fs, 'categoriesbsct'), {
                    title,
                    createdAt: Date.now(),
					updatedAt: Date.now(),
                })
                if(files && files.length > 0) {
                    await HandleFile.HandleFiles(files, snap.id, 'categoriesbsct')
                }
                handleClose()
                setIsLoading(false)
            }catch (error:any) {
                message.error(error.message)
                setIsLoading(false)
            }
        }
    }
  return (
    <Modal 
        open={visible}
        onOk={handleAddNewCatrgoryBSCT}
        loading={isLoading}
        onCancel={handleClose}
        title='Tạo mới danh mục sản phẩm' >
            <div className="mb-3 mt-3">
                <Input
                    size='large'
                    placeholder='title'
                    maxLength={150}
                    showCount
                    allowClear
                    value={title}
                    onChange={val => setTitle(val.target.value)}
                />
                {files.length > 0 && (
                    <div className='mt-4'>
                        <img 
                            src={URL.createObjectURL(files[0])}
                            style={{
                                width : 200,
                                height : 'auto'
                            }}
                            alt=''
                        />
                    </div>
                )}
                <ImagePicker loading={isLoading} onSelected={(vals) => setFiles(vals)} />
            </div>
            
    </Modal>
  )
}

export default AddNewCategoryBSCT