import {Loader} from "../components/common/preloader";
import {useState} from "react";
import {postPasswordUpdate} from "../helpers/backend_helper";
import {useRouter} from "next/router";
import swalAlert from "../components/common/alert";
import Head from "next/head";
import {Form} from "antd";
import FormInput from "../components/form/input";
import PasswordInput from "../components/form/password";
import Link from "next/link";

const Reset = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const handleReset = async values => {
        setLoading(true)
        postPasswordUpdate({...values, token: router?.query?.token}).then(({success, message}) => {
            setLoading(false)
            if (success === true) {
                swalAlert.success(message).then(() => {
                    router.push('/login')
                })
            } else {
                setError(message)
            }
        })
    }

    if (loading) {
        return (
            <div className="loader block">
                <Loader/>
            </div>
        )
    }
    return  (
        <>
            <Head>
                <title>Forget Password</title>
            </Head>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
                <div className="p-10 -mt-16 xs:p-0 mx-auto md:w-full md:max-w-md">
                    <Link href="/">
                        <h1 className="font-medium text-center text-2xl mb-4" role="button">Coxsea</h1>
                    </Link>
                    <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                        <div className="px-4 pt-2 pb-4">
                            <h1 className="font-medium text-center text-xl py-2">Reset Password</h1>
                            {error && <p className="pt-3 mb-2 text-sm text-danger">{error}</p>}
                            <Form layout="vertical" onFinish={handleReset}>
                                <PasswordInput name="password" label="Password" required/>
                                <PasswordInput name="confirm_password" label="Confirm Password" confirm required/>
                                <button className="btn btn-primary mt-2 w-full" disabled={loading}>Reset Password</button>
                            </Form>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-500 text-sm">Don't have an account? <a className="text-primary" href={"/signup"}>Signup</a></p>
                </div>
            </div>
        </>
    )
}
export default Reset