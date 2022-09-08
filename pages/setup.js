import {Form} from "antd";
import FormInput from "../components/form/input";
import PasswordInput from "../components/form/password";
import Button from "../components/common/button";
import {useAction} from "../helpers/hooks";
import {postSetupSite} from "../helpers/backend_helper";

const Setup = () => {


    const handleSetupSite = values => {
        return useAction(postSetupSite, values, () => {

        })
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen w-full bg-gray-1">
                <div className="bg-white p-4 rounded w-[90%] md:w-[450px] shadow-sm mt-4 mb-12">
                    <h1 className="text-xl font-bold text-gray-600 text-center mb-4">Setup</h1>
                    <Form layout="vertical" onFinish={handleSetupSite}>
                        <FormInput name="shop_name" label="Shop Name" placeholder="Enter your shop name" required/>
                        <FormInput name="email" label="Admin Email" placeholder="Enter your admin email" required/>
                        <PasswordInput name="password" label="Admin Password" placeholder="Enter your admin password" required/>
                        <PasswordInput name="confirm_password" label="Confirm Admin Password" placeholder="Enter your admin password again" confirm required/>
                        <Button>Submit</Button>
                    </Form>
                </div>
            </div>
        </>
    )
}
export default Setup