import {Form} from "antd";
import FormInput from "../components/form/input";
import PasswordInput from "../components/form/password";
import Button from "../components/common/button";

const Setup = () => {
    return (
        <>
            <div className="flex justify-center items-center h-screen w-full bg-gray-1">
                <div className="bg-white p-4 rounded w-[90%] md:w-[450px] shadow-sm mt-4 mb-12">
                    <h1 className="text-xl font-bold text-gray-600 text-center mb-4">Setup</h1>
                    <Form layout="vertical">
                        <FormInput name="site_title" label="Site Title" placeholder="Enter your site title"/>
                        <FormInput name="email" label="Admin Email" placeholder="Enter your admin email"/>
                        <PasswordInput label="Admin Password" placeholder="Enter your admin password"/>
                        <PasswordInput label="Confirm Admin Password" placeholder="Enter your admin password again" confirm/>
                        <Button>Submit</Button>
                    </Form>
                </div>

            </div>

        </>
    )
}
export default Setup