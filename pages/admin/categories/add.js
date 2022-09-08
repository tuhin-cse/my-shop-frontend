import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import Card from "../../../components/common/card";
import {Form} from "antd";
import FormInput, {HiddenFormItem} from "../../../components/form/input";
import FormSelect from "../../../components/form/select";
import ImageInput from "../../../components/form/image";
import {useEffect, useState} from "react";
import Button from "../../../components/common/button";
import {uploadImage} from "../../../helpers/image";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchCategory, postCategory} from "../../../helpers/backend_helper";
import {useRouter} from "next/router";

const AddCategory = () => {
    const {query} = useRouter()
    const [category, getCategory] = useFetch(fetchCategory, {}, false)
    useEffect(() => {
        if (query.parent) {
            getCategory({_id: query.parent})
        }
    }, [query])

    const [image, setImage] = useState('/img/category.png')

    return (
        <>
            <PageTitle title={category ? `Add Sub Category ${category?.name || ''}` : "Add Category"}/>
            <CategoryForm image={image} setImage={setImage} parent={category}/>
        </>
    )
}

AddCategory.layout = UserLayout
export default AddCategory

export const CategoryForm = ({form, image, setImage, parent}) => {
    const {push} = useRouter()
    return (
        <>
            <div className="w-full md:w-1/2">
                <Card>
                    <Form form={form} layout="vertical" onFinish={async values => {
                        values.image = await uploadImage(values.image, image)
                        return useAction(postCategory, values, () => push(`/admin/categories/${parent?._id || ''}`))
                    }}>
                        <HiddenFormItem name="_id"/>
                        {parent && <HiddenFormItem name="parent" initialValue={parent._id}/>}
                        <FormInput label="Name" name="name" required/>
                        <FormSelect name="active" label="Status"
                                    initialValue={true}
                                    options={[{label: 'Active', value: true}, {label: 'Inactive', value: false}]}
                                    required/>
                        <Form.Item name="image" label={"Category Image"}>
                            <ImageInput onSelect={setImage}/>
                        </Form.Item>
                        <img className="h-28 pb-4" src={image} alt=""/>
                        <FormInput name="description" label="Description" textArea/>
                        <Button>Submit</Button>
                    </Form>
                </Card>
            </div>
        </>
    )
}