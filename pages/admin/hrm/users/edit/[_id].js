import PageTitle from "../../../../../components/common/page-title";
import {UserForm} from "../add";
import UserLayout from "../../../../../layouts/user";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useFetch} from "../../../../../helpers/hooks";
import {fetchUser} from "../../../../../helpers/backend_helper";
import {Form} from "antd";
import moment from "moment";

const EditUser = () => {
    const [image, setImage] = useState('/img/profile.png')
    const [id, setID] = useState('/img/profile.png')
    const [country, setCountry] = useState()
    const [form] = Form.useForm()

    const {query} = useRouter()
    const [user] = useFetch(fetchUser, query)

    useEffect(() => {
        if(user) {
            form.setFieldsValue({
                ...user,
                roles: user?.roles?.map(d => d?._id),
                birthday: moment(user?.birthday, 'YYYY-MM-DD')
            })
        }
    }, [user])

    return (
        <>
            <PageTitle
                title="Edit User"/>
            <UserForm
                id={id}
                form={form}
                setID={setID}
                image={image}
                country={country}
                setImage={setImage}
                setCountry={setCountry}
                update={true}
            />
        </>
    )
}
EditUser.layout = UserLayout
export default EditUser