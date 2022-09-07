import PageTitle from "../../../../components/common/page-title";
import {ProductForm} from "../add";
import UserLayout from "../../../../layouts/user";
import {useRouter} from "next/router";
import {useFetch} from "../../../../helpers/hooks";
import {fetchCategories, fetchProduct} from "../../../../helpers/backend_helper";
import {useEffect, useState} from "react";
import {Form} from "antd";

const EditProduct = () => {
    const [form] = Form.useForm()
    const {query} = useRouter()
    const [product] = useFetch(fetchProduct, {_id: query._id})
    const [subCategories, getSubCategories] = useFetch(fetchCategories, {}, false)
    useEffect(() => {
       if(product) {
           form.setFieldsValue({
               ...product,
               image: undefined,
               categories: product?.categories?.map(c => c._id),
               sub_categories: product?.sub_categories?.map(c => c._id),
           })
           setImage(product.image)
           getSubCategories({parents: product?.categories?.map(c => c._id)})
       }
    }, [product])

    const [image, setImage] = useState('/img/product.png')


    return (
        <>
            <PageTitle
                title="Update Product"
                breadcrumbs={[
                    {label: 'Dashboard', href: '/'},
                    {label: 'Products', href: '/products'},
                    {label: 'Edit Product'}]}/>
            <ProductForm form={form} image={image} setImage={setImage} subCategories={subCategories} getSubCategories={getSubCategories}/>
        </>
    )
}
EditProduct.layout = UserLayout
export default EditProduct