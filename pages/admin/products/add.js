import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import Card from "../../../components/common/card";
import {Form} from "antd";
import {Col, Row} from "react-bootstrap";
import FormInput, {HiddenFormItem} from "../../../components/form/input";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchCategories, postProduct} from "../../../helpers/backend_helper";
import FormSelect from "../../../components/form/select";
import Button from "../../../components/common/button";
import {FiTrash} from "react-icons/fi";
import ImageInput from "../../../components/form/image";
import {useState} from "react";
import {useRouter} from "next/router";
import {uploadImage} from "../../../helpers/image";

const AddProduct = () => {
    const [image, setImage] = useState('/img/product.png')
    return (
        <>
            <PageTitle
                title="Add Product"
                breadcrumbs={[
                    {label: 'Dashboard', href: '/'},
                    {label: 'Products', href: '/products'},
                    {label: 'Add Product'}]}/>
            <ProductForm image={image} setImage={setImage}/>
        </>
    )
}
AddProduct.layout = UserLayout
export default AddProduct


export const ProductForm = ({form, image, setImage}) => {
    const [categories] = useFetch(fetchCategories)
    const router = useRouter()
    const handleProductAdd = async values => {
        values.image = await uploadImage(values.image, image)
        return useAction(postProduct, values, () => {
            router.push('/admin/products')
        })
    }

    return (
        <Form form={form} layout="vertical" onFinish={handleProductAdd}>
            <Row>
                <Col md={7}>
                    <Card title="Product Details">
                        <HiddenFormItem name="_id"/>
                        <FormInput name="name" label="Name" required/>
                        <Row>
                            <Col md={6}>
                                <FormSelect
                                    name="category"
                                    label="Categories"
                                    options={categories}
                                    required/>
                            </Col>
                            <Col md={6}>
                                <FormSelect name="unit" label="Unit"
                                            options={[
                                                {label: 'Piece', value: 'Piece'},
                                                {label: 'Litre', value: 'litre'},
                                                {label: 'KG', value: 'kg'},
                                                {label: 'GM', value: 'gm'}
                                            ]}
                                            required/>
                            </Col>
                            <Col md={6}>
                                <FormInput name="code" label="Barcode" required/>
                            </Col>
                            <Col md={6}>
                                <FormSelect name="active" label="Status"
                                            initialValue={true}
                                            options={[{label: 'Active', value: true}, {
                                                label: 'Inactive',
                                                value: false
                                            }]}
                                            required/>
                            </Col>
                        </Row>
                        <FormInput name="description" label="Description" textArea/>
                        <Form.Item name="image" label={"Image"}>
                            <ImageInput onSelect={setImage}/>
                        </Form.Item>
                        <img className="h-32 pb-4" src={image} alt=""/>
                        <Button>Submit</Button>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card title="Variants">
                        <Form.List name="variants">
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.map(({key, name}) => (
                                        <Row key={key} className="mb-2">
                                            <Col xs={6}>
                                                <FormInput name={[name, 'name']} placeholder="Name" required/>
                                            </Col>
                                            <Col xs={5}>
                                                <FormInput name={[name, 'quantity']} placeholder="Quantity" required/>
                                            </Col>
                                            <Col xs={1}>
                                                <FiTrash onClick={() => remove(name)} className="mt-2.5 text-danger"
                                                         role="button" size={18}/>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button type="button" onClick={() => add()}>Add Variant</Button>
                                </>
                            )}
                        </Form.List>
                    </Card>
                </Col>
            </Row>
        </Form>

    )
}