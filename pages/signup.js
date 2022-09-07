import {Form} from "antd";
import Head from "next/head";
import FormInput from "../components/form/input";
import PasswordInput from "../components/form/password";
import {useState} from "react";
import {postLogin, postSignup} from "../helpers/backend_helper";
import {useRouter} from "next/router";
import PhoneInput from "../components/form/phone";
import {Col, Row} from "react-bootstrap";
import {Loader} from "../components/common/preloader";
import Link from "next/link";

const Login = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const handleLogin = async values => {
        setLoading(true)
        const {success, data, message} = await postSignup(values)
        if(success === true) {
            localStorage.setItem('authToken', data.token)
            await router.push('/')
        } else {
            setError(message)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="loader block">
                <Loader/>
            </div>
        )
    }


    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center bg-img-3 sm:py-12">
                <div className="p-10 -mt-16 xs:p-0 mx-auto md:w-full md:max-w-3xl">
                    <Link href="/">
                        <h1 className="font-medium text-center text-2xl mb-4 text-white" role="button">Coxsea</h1>
                    </Link>
                    <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                        <div className="px-4 pt-2 pb-4">
                            <h1 className="font-medium text-center text-xl py-2">Signup</h1>
                            {error && <p className="pt-3 mb-2 text-sm text-danger">{error}</p>}
                            <Form layout="vertical" onFinish={handleLogin}>
                                <p className="text-xs text-gray-500 mb-2">Business Info</p>
                                <Row>
                                    <Col md={6}>
                                        <FormInput name="business_name" label="Business Name" required/>
                                    </Col>
                                    <Col md={6}>
                                        <FormInput name="address" label="Address" required/>
                                    </Col>
                                </Row>
                                <hr className="text-gray-300 mb-2"/>
                                <p className="text-xs text-gray-500 mb-2">Owner Info</p>
                                <Row>
                                    <Col md={6}>
                                        <FormInput name="first_name" label="First Name" required/>
                                        <PhoneInput required/>
                                        <PasswordInput name="password" label="Password" required/>
                                    </Col>
                                    <Col md={6}>
                                        <FormInput name="last_name" label="Last Name" required/>
                                        <FormInput name="email" label="Email" isEmail required/>
                                        <PasswordInput name="confirm_password" label="Confirm Password" confirm required/>
                                    </Col>
                                </Row>
                                <button className="btn btn-primary mt-2 w-full" disabled={loading}>Sign Up</button>
                            </Form>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-300 text-sm">Already an account? <a className="text-white" href={"/login"}>Login</a></p>
                </div>
            </div>

        </>
    )
}
export default Login