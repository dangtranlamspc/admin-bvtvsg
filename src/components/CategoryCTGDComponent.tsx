
import { fs } from '@/firebase/firebaseConfig';
import { CategoryCTGDModel } from '@/models/CategoryCTGDModel';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

type Props = {
	id?: string;
};

const CategoryCTGDComponent = (props: Props) => {
    const { id } = props;
	const [categoryCTGD, setCategoryCTGD] = useState<CategoryCTGDModel>();

	useEffect(() => {
		id && getCategoryCTGDDetail();
	}, [id]);

	const getCategoryCTGDDetail = async () => {
		const api = `${'categoriesctgd'}/${id}`;
		try {
			const snap: any = await getDoc(doc(fs, api));
			if (snap.exists()) {
				setCategoryCTGD({
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
  return categoryCTGD ? categoryCTGD.title : '';
}

export default CategoryCTGDComponent