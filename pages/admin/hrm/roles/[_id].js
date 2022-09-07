import PageTitle from "../../../../components/common/page-title";
import UserLayout from "../../../../layouts/user";
import {RoleForm} from "./add";
import {Form} from "antd";
import {useFetch} from "../../../../helpers/hooks";
import {fetchRole} from "../../../../helpers/backend_helper";
import {useRouter} from "next/router";
import {useEffect} from "react";

const AddRole = () => {
    const {query} = useRouter()
    const [form] = Form.useForm()
    const [role] = useFetch(fetchRole, query)

    useEffect(() => {
        if(!!role) {
            form.setFieldsValue(role)
        }

    }, [role])

    return (
        <>
            <PageTitle title="Edit Role"/>
            <RoleForm form={form}/>
        </>
    )
}
AddRole.layout = UserLayout
export default AddRole