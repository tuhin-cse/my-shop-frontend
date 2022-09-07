import HomeLayout from "../layouts/home";
import {useState} from "react";
import {useAction} from "../helpers/hooks";
import {postCheckBalance} from "../helpers/backend_helper";
import {Form, Modal} from "antd";
import PasswordInput from "../components/form/password";
import Button from "../components/common/button";
import {encryptPassword} from "./admin/pos";
import FormInput from "../components/form/input";

const CheckBalance = () => {
    const [passForm] = Form.useForm()
    const [visiblePass, setVisiblePass] = useState(false)
    const [card, setCard] = useState('')
    const [details, setDetails] = useState()
    const handleCardChange = value => {
        let card = value.replaceAll(/\D/g, '')
        setCard(card?.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`).join('').substring(0, 19))
    }
    const [error, setError] = useState('')
    const handleSubmit = () => {
        setError('')
        if (card?.length === 19 && card?.replaceAll('-', '').length === 16 && card.substring(0, 4) === '7489') {
            setVisiblePass(true)
        } else {
            setError('Invalid card number')
        }
    }

    return (
        <div className="my-4 md:my-12">

            <Modal title="Verify Card" style={{marginTop: 80}} footer={null}
                   visible={visiblePass}
                   onCancel={() => {
                       setVisiblePass(false)
                       passForm.resetFields()
                   }} destroyOnClose>
                <Form form={passForm} layout="vertical" onFinish={values => {
                    console.log(values)
                    return useAction(postCheckBalance, {
                        card: card?.replaceAll('-', ''),
                        password: encryptPassword(values.password)
                    }, d => {
                        setVisiblePass(false)
                        passForm.resetFields()
                        setDetails(d)
                    }, false)
                }}>
                    <FormInput name="password" label="Password"
                               style={{webkitTextSecurity: 'disc'}}/>
                    <Button>Verify</Button>
                </Form>
            </Modal>

            <div className="flex flex-wrap sm:justify-between">
                <div className="w-full sm:w-auto">
                    <h1 className="text-3xl font-medium">Find Your Balance</h1>
                    <h4 className="text-xl mb-3">Give your card number</h4>
                    <input value={card} onChange={e => handleCardChange(e.target.value)}
                           className="form-control sm:w-72 mb-1"
                           placeholder="7489-xxxx-xxxx-xxxx"/>
                    <p className="text-sm text-danger">{error}</p>
                    <button className="btn btn-danger mt-2 me-2" onClick={() => {
                        setError('')
                        setDetails(undefined)
                        setCard('')
                    }}>Cancel
                    </button>
                    <button className="btn btn-primary mt-2.5" onClick={handleSubmit}>Submit</button>
                </div>
                <div className="w-full sm:w-auto">
                    {details && (
                        <div className="border p-4 rounded flex sm:w-96">
                            <div className="p-2.5">
                                <img src={details?.beneficiary?.image || '/img/profile.png'} className="w-20" alt=""/>
                            </div>
                            <div className="p-2.5">
                                <p>Name: {details?.beneficiary?.first_name} {details?.beneficiary?.last_name}</p>
                                <p>Balance: {details?.balance} </p>
                                <p>Address: {details?.address} </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
CheckBalance.layout = HomeLayout
export default CheckBalance