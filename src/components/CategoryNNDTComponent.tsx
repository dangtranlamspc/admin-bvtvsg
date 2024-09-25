
import { fs } from '@/firebase/firebaseConfig';
import { CategoryNNDTModel } from '@/models/CategoryNNDTModel';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

type Props = {
	id?: string;
};

const CategoryNNDTComponent = (props: Props) => {
    const { id } = props;
	const [categoryNNDT, setCategoryNNDT] = useState<CategoryNNDTModel>();

	useEffect(() => {
		id && getCategoryNNDTDetail();
	}, [id]);

	const getCategoryNNDTDetail = async () => {
		const api = `${'categoriesnndt'}/${id}`;
		try {
			const snap: any = await getDoc(doc(fs, api));
			if (snap.exists()) {
				setCategoryNNDT({
					id: snap.id,
					...snap.data(),
				});
			} else {
				console.log(`file not found`);
			}
		} catch (error) {
			console.log(error);
		}
	};
  return categoryNNDT ? categoryNNDT.title : '';
};

export default CategoryNNDTComponent