import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import Card from "../../../components/common/card";
import {Form, Tabs} from "antd";
import {Col, Row} from "react-bootstrap";
import FormInput from "../../../components/form/input";
import {useEffect, useState} from "react";
import Button from "../../../components/common/button";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchSettings, postSettings} from "../../../helpers/backend_helper";
import ImageInput from "../../../components/form/image";
import FormSelect from "../../../components/form/select";
import {uploadImage} from "../../../helpers/image";

const Home = () => {
    const [form] = Form.useForm()
    const [settings, getSettings] = useFetch(fetchSettings)
    const [logo, setLogo] = useState('/img/shops.png')

    useEffect(() => {
        if (settings) {
            form.setFieldsValue({
                ...settings,
                logo: undefined,
            })
            setLogo(settings?.logo || '/img/shops.png')
        }
    }, [settings])

    const [active, setActive] = useState(0)
    const options = [
        {
            label: 'Site Settings',
            form: (
                <Row>
                    <Col md={6}>
                        <FormInput name="site_name" label="Site Name" required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="site_email" label="Site Email" isEmail required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="site_phone" label="Site Phone Number" required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="currency_name" label="Currency Name" required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="site_footer" label="Site Footer" required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="currency_code" label="Currency Code" required/>
                    </Col>
                    <Col md={6}>
                        <Form.Item name="logo" label={"Site Logo"}>
                            <ImageInput onSelect={setLogo}/>
                        </Form.Item>
                        <img className="h-28 pb-4" src={logo} alt=""/>
                    </Col>
                    <Col md={6}>
                        <FormInput name="address" label="Address" textArea required/>
                        <FormInput name="description" label="Description" textArea required/>
                    </Col>
                </Row>
            )
        },
        {
            label: 'Whatsapp SMS Settings',
            form: (
                <>
                    <FormInput name={['whatsapp', 'token']} label="WATI Auth Token" placeholder="Your WATI Auth Token"
                               required/>
                    <FormInput name={['whatsapp', 'endpoint']} label="WATI API Endpoint"
                               placeholder="Your WATI API Endpoint"
                               required/>
                    <FormInput name={['whatsapp', 'otp_template']} label="WATI Verification Code Template Name"
                               placeholder="Your WATI Template Name" required/>
                    <FormInput name={['whatsapp', 'password_template']} label="WATI Password Template Name"
                               placeholder="Your WATI Template Name" required/>
                </>
            )
        },
        {
            label: 'SMS Settings',
            form: (
                <Row>
                    <Col md={6}>
                        <FormInput
                            name={['twilio', 'token']}
                            label="Twilio Auth Token"
                            placeholder="Your Twilio Auth Token"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormInput name={['twilio', 'sender']} label="Twilio Sender Number"
                                   placeholder="Your Twilio Sender number" required/>
                    </Col>
                    <Col md={6}>
                        <FormInput
                            name={['twilio', 'sid']}
                            label="Twilio Account SID"
                            placeholder="Your Twilio Account SID"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormSelect name={['twilio', 'status']} label="Status"
                                    initialValue={false}
                                    options={[{label: 'Enable', value: true}, {label: 'Disable', value: false}]}
                                    required/>
                    </Col>
                </Row>
            )
        },
        {
            label: 'Payment Settings',
            form: (
                <>
                    <Tabs type="card">
                        <Tabs.TabPane tab="Stripe" key="1">
                            <FormInput
                                name={['payment', 'stripe_key']}
                                label="Stripe Key"
                                placeholder="Your Stripe Key"
                                required/>
                            <FormInput
                                name={['payment', 'stripe_secret']}
                                label="Stripe Secret"
                                placeholder="Your Stripe Secret"
                                required/>
                            <FormSelect name={['payment', 'stripe_status']} label="Status"
                                        initialValue={false}
                                        options={[{label: 'Enable', value: true}, {label: 'Disable', value: false}]}
                                        required/>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Razorpay" key="2">
                            <FormInput
                                name={['payment', 'razorpay_key']}
                                label="Razorpay Key"
                                placeholder="Your Razorpay Key"
                                required/>
                            <FormInput
                                name={['payment', 'razorpay_secret']}
                                label="Razorpay Secret"
                                placeholder="Your Razorpay Secret"
                                required/>
                            <FormSelect name={['payment', 'razorpay_status']} label="Status"
                                        initialValue={false}
                                        options={[{label: 'Enable', value: true}, {label: 'Disable', value: false}]}
                                        required/>
                        </Tabs.TabPane>
                    </Tabs>
                </>
            )
        },
        {
            label: 'Email Settings',
            form: (
                <Row>
                    <Col md={6}>
                        <FormInput
                            name={['email', 'host']}
                            label="Mail Host"
                            placeholder="Your Mail Host"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormInput
                            name={['email', 'port']}
                            label="Mail Port"
                            placeholder="Your Mail Port"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormInput
                            name={['email', 'username']}
                            label="Mail Username"
                            placeholder="Your Mail Username"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormInput
                            name={['email', 'password']}
                            label="Mail Password"
                            placeholder="Your Mail Password"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormInput
                            name={['email', 'from_name']}
                            label="Mail From Name"
                            placeholder="Your Mail From Name"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormInput
                            name={['email', 'from']}
                            label="Mail From Address"
                            placeholder="Your Mail From Address"
                            required/>
                    </Col>
                    <Col md={6}>
                        <FormSelect name={['email', 'status']} label="Status"
                                    initialValue={false}
                                    options={[{label: 'Enable', value: true}, {label: 'Disable', value: false}]}
                                    required/>
                    </Col>

                </Row>
            )
        },
    ]


    return (
        <>
            <PageTitle title="Settings" breadcrumbs={[{label: 'Dashboard', href: '/admin'}, {label: 'Settings'}]}/>
            <Row>
                <Col md={3}>
                    <div className="bg-white rounded overflow-hidden shadow-sm">
                        {options?.map((option, index) => (
                            <div
                                onClick={() => setActive(index)}
                                className={`px-4 py-2 text-sm ${active === index ? 'bg-main text-white' : ''}`}
                                role="button" key={index}>
                                {option.label}
                            </div>
                        ))}
                    </div>
                </Col>
                <Col md={9}>
                    <Card>
                        <div className="border mb-3 p-2 text-main inline-block">
                            {options[active].label}
                        </div>
                        <Form layout="vertical" form={form} onFinish={async values => {
                            values.logo = await uploadImage(values.logo, logo)
                            return useAction(postSettings, values, () => {
                                getSettings()
                            })
                        }}>
                            {options[active]?.form}
                            <Button>{'Submit'}</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
Home.layout = UserLayout
export default Home
