import {Form} from "antd";
import Head from "next/head";
import FormInput from "../components/form/input";
import PasswordInput from "../components/form/password";
import {useState} from "react";
import {postLogin} from "../helpers/backend_helper";
import {useRouter} from "next/router";
import {useSite} from "../contexts/site";
import HomeLayout from "../layouts/home";

const Login = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const handleLogin = async values => {
        setError('')
        setLoading(true)
        const {error, token, msg} = await postLogin(values)
        if (error === false) {
            localStorage.setItem('authToken', token)
            await router.push('/admin')
        } else {
            setError(msg)
            setLoading(false)
        }
    }

    const site = useSite()

    return (
        <>
            <Head>
                <title>Login | {site?.site_name}</title>
            </Head>
            <div className="py-4 md:py-12 flex">
                <div className="w-full md:w-1/2">
                   <div className="md:max-w-md">
                       <h1 className="font-medium text-2xl font-bold pb-3 border-b mb-4">Login</h1>
                       {error && <p className="px-4 my-2 text-sm text-danger">{error}</p>}
                       <Form layout="vertical" className="" onFinish={handleLogin}>
                           <FormInput name="email" label="Email / Username" required/>
                           <PasswordInput name="password" label="Password" required/>
                           <button className="btn btn-primary w-full" disabled={loading}>{
                               loading ? <div className="dot-typing mx-auto my-2"/> : "Login"
                           }</button>
                       </Form>
                   </div>
                </div>
                <div className="w-0 md:w-1/2 hidden md:block">
                    <img src="/img/screenshot.png" alt=""/>
                </div>
            </div>
        </>
    )
}
Login.layout = HomeLayout
export default Login