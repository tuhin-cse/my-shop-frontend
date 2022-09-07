import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {Col, Row} from "react-bootstrap";
import FormInput from "../../../components/form/input";
import PhoneInput from "../../../components/form/phone";
import Card from "../../../components/common/card";
import {Form} from "antd";
import Button from "../../../components/common/button";
import {useUserContext} from "../../../contexts/user";
import {useEffect, useState} from "react";
import {useAction, useFetch} from "../../../helpers/hooks";
import {getProfile, postPassword, postProfile} from "../../../helpers/backend_helper";
import PasswordInput from "../../../components/form/password";
import ImageInput from "../../../components/form/image";
import {useI18n} from "../../../contexts/i18n";
import {uploadImage} from "../../../helpers/image";

const Profile = () => {
    const [form] = Form.useForm()
    const [form2] = Form.useForm()
    const user = useUserContext()
    const [image, setImage] = useState('/img/profile.png')
    const i18n = useI18n()
    const [profile, fetchProfile] = useFetch(getProfile)

    useEffect(() => {
        if (profile) {
            form.setFieldsValue({
                ...profile,
                image: undefined,
            })
            setImage(profile?.image)
        }
    }, [profile])

    return (
        <>
            <PageTitle title="Profile" breadcrumbs={[{label: 'Dashboard', href: '/'}, {label: 'Profile'}]}/>
            <Row>
                <Col md={6}>
                    <Card>
                        <div className="relative p-3">
                            <div className="avatar w-32">
                                <img src={profile?.image || '/img/profile.png'} className="avatar-lg rounded-full mb-4"
                                     alt="avatar"/>
                            </div>
                            <div>
                                <table className="w-full mt-2">
                                    <tbody>
                                    <tr>
                                        <th className="w-24 text-sm">Name</th>
                                        <td>{profile?.first_name} {profile?.last_name}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-24 text-sm">Phone</th>
                                        <td>{profile?.phone} </td>
                                    </tr>
                                    <tr>
                                        <th className="w-24 text-sm">Email</th>
                                        <td>{profile?.email} </td>
                                    </tr>
                                    <tr>
                                        <th className="w-24 text-sm">Role</th>
                                        <td>{profile?.roles?.map((d, index) => `${index > 0 ? ', ' : ''}${d?.name}`)}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-24 text-sm">Address</th>
                                        <td>{profile?.address}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                    <Card title="Change Password">
                        <Form layout="vertical" form={form2} onFinish={values => useAction(postPassword, values, () => {
                            form2.resetFields()
                        })}>
                            <PasswordInput name="current_password" label="Current Password" required/>
                            <PasswordInput name="password" label="New Password" noCurrent required/>
                            <PasswordInput name="password_confirmation" label="Confirm Password" confirm required/>
                            <Button>Submit</Button>
                        </Form>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Form layout="vertical" form={form} onFinish={async values => {
                            values.image = await uploadImage(values.image, image)
                            return useAction(postProfile, values, () => fetchProfile())
                        }}>
                            <Row>
                                <Col sm={6}>
                                    <FormInput name="first_name" label="First Name" required/>
                                </Col>
                                <Col sm={6}>
                                    <FormInput name="last_name" label="Last Name" required/>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <FormInput name="email" label="Email" isEmail readOnly required/>
                                </Col>
                                <Col sm={6}>
                                    <PhoneInput required/>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <Form.Item name="image" label={i18n.t("Image")}>
                                        <ImageInput onSelect={setImage}/>
                                    </Form.Item>
                                    <img className="h-32 pb-4" src={image} alt=""/>
                                </Col>
                                <Col sm={6}>
                                    <FormInput name="address" label="Address" textArea/>
                                </Col>
                            </Row>
                            <Button>Save</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
Profile.layout = UserLayout
export default Profile