import UserLayout from "../../../../layouts/user";
import PageTitle from "../../../../components/common/page-title";
import Card from "../../../../components/common/card";
import {Form} from "antd";
import {Col, Row} from "react-bootstrap";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchCategories, fetchRoles, postProduct, postUser} from "../../../../helpers/backend_helper";
import FormSelect from "../../../../components/form/select";
import Button from "../../../../components/common/button";
import {FiTrash} from "react-icons/fi";
import ImageInput from "../../../../components/form/image";
import {useState} from "react";
import {useRouter} from "next/router";
import {uploadImage} from "../../../../helpers/image";
import PasswordInput from "../../../../components/form/password";
import CountryInput, {CityInput} from "../../../../components/form/country";
import {idTypes} from "../../../../helpers/consts";
import LocationInput from "../../../../components/form/location";

const AddProduct = () => {
    const [image, setImage] = useState('/img/profile.png')
    const [id, setID] = useState('/img/profile.png')
    const [country, setCountry] = useState()

    return (
        <>
            <PageTitle
                title="Add User"/>
            <UserForm
                id={id}
                setID={setID}
                image={image}
                country={country}
                setImage={setImage}
                setCountry={setCountry}
            />
        </>
    )
}
AddProduct.layout = UserLayout
export default AddProduct


export const UserForm = ({form, image, setImage, id, setID, country, setCountry, update = false}) => {
    const [roles] = useFetch(fetchRoles)
    const router = useRouter()
    const handleUserAdd = async values => {
        values.birthday = values?.birthday?.format('YYYY-MM-DD')
        values.image = await uploadImage(values.image, image)
        values.id = await uploadImage(values.id, id)
        return useAction(postUser, values, () => {
            router.push('/admin/hrm/users')
        })
    }

    return (
        <Form form={form} layout="vertical" onFinish={handleUserAdd}>
            <Row>
                <Col md={7}>
                    <Card>
                        <HiddenFormItem name="_id"/>
                        <Row>
                            <Col md={6}>
                                <FormInput name="first_name" label="First Name" required/>
                            </Col>
                            <Col md={6}>
                                <FormInput name="last_name" label="Last Name" required/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormInput name="email" label="Email" isEmail required/>
                            </Col>
                            <Col md={6}>
                                <FormInput name="phone" label="Phone" required/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormInput name="username" label="Username" required/>
                            </Col>
                            <Col md={6}>
                                <PasswordInput name="password" label="Password" min={6} required={!update}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormInput name="birthday" label="Birthday" type="date" required/>
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
                        <Row>
                            <Col md={6}>
                                <FormInput name="id_number" label="ID Number" required/>
                            </Col>
                            <Col md={6}>

                                <FormSelect name="id_type" label="Id Type"
                                            options={idTypes}
                                            required/>
                            </Col>
                        </Row>
                        <LocationInput form={form}/>
                        <Button>Submit</Button>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card>
                        <FormSelect name="roles" label="Roles" initialValue={[]} options={roles} isMulti required/>
                        <Form.Item name="id" label="ID Image">
                            <ImageInput onSelect={setID}/>
                        </Form.Item>
                        <img className="h-32 pb-4" src={id} alt=""/>
                        <Form.Item name="image" label="Profile Image">
                            <ImageInput onSelect={setImage}/>
                        </Form.Item>
                        <img className="h-32 pb-4" src={image} alt=""/>
                    </Card>
                </Col>
            </Row>
        </Form>

    )
}