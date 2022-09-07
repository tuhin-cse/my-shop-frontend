import {useRouter} from "next/router";
import {useFetch} from "../../../../helpers/hooks";
import {fetchCategory} from "../../../../helpers/backend_helper";
import {useEffect, useState} from "react";
import PageTitle from "../../../../components/common/page-title";
import UserLayout from "../../../../layouts/user";
import {CategoryForm} from "../add";
import {Form} from "antd";


const EditCategory = () => {
    const [form] = Form.useForm()
    const {query} = useRouter()
    const [category] = useFetch(fetchCategory, query)
    const [parent, getParent] = useFetch(fetchCategory, {}, false)
    useEffect(() => {
        if(query.parent) {
            getParent({_id: query.parent})
        }
    }, [query])

    useEffect(() => {
        if(!!category) {
            form.setFieldsValue({
                ...category,
                image: ''
            })
            setImage(category.image)
        }
    }, [category])

    const [image, setImage] = useState('/img/category.png')

    return (
        <>
            <PageTitle title={parent ? `Edit Sub Category ${parent?.name || ''}` : "Edit Category"}/>
            <CategoryForm form={form} image={image} setImage={setImage} parent={parent}/>
        </>
    )
}

EditCategory.layout = UserLayout
export default EditCategory