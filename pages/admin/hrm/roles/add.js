import PageTitle from "../../../../components/common/page-title";
import UserLayout from "../../../../layouts/user";
import {Col, Row} from "react-bootstrap";
import {Form} from "antd";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import Button from "../../../../components/common/button";
import Card from "../../../../components/common/card";
import {useAction} from "../../../../helpers/hooks";
import {postRole} from "../../../../helpers/backend_helper";
import {useRouter} from "next/router";

const AddRole = () => {
    return (
        <>
            <PageTitle title="Add Role"/>
            <RoleForm/>
        </>
    )
}
AddRole.layout = UserLayout
export default AddRole


export const RoleForm = ({form}) => {
    const {push} = useRouter()
    return (
        <>
            <Row>
                <Col md={6}>
                    <Card>
                        <Form layout="vertical" form={form}
                              onFinish={values => useAction(postRole, values, () => push('/admin/hrm/roles'))}>
                            <HiddenFormItem name="_id"/>
                            <FormInput label="Name" name="name" required/>
                            <Button>Submit</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}