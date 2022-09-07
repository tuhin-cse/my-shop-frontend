import PageTitle from "../../../../components/common/page-title";
import UserLayout, {havePermission} from "../../../../layouts/user";
import Table from "../../../../components/common/table";
import Button from "../../../../components/common/button";
import {useRouter} from "next/router";
import {useFetch} from "../../../../helpers/hooks";
import {deleteRole, fetchRoles} from "../../../../helpers/backend_helper";
import {FaPlus} from "react-icons/fa";
import {useUserContext} from "../../../../contexts/user";

const Roles = () => {
    const {push} = useRouter()
    const {roles: userRoles} = useUserContext()
    const [roles, getRoles, {loading, error}] = useFetch(fetchRoles)

    const columns = [
        {dataField: 'name', text: 'Name'},
    ]

    return (
        <>
            <PageTitle title="Roles"/>
            <Table
                indexed
                columns={columns}
                data={roles}
                onReload={getRoles}
                loading={loading}
                error={error}
                onDelete={deleteRole}
                onEdit={({_id}) => push('/admin/hrm/roles/' + _id)}
                action={<Button onClick={() => push('/admin/hrm/roles/add')}>Add Role</Button>}
                actions={({_id}) => (
                   <>
                       {havePermission('role_edit', userRoles) && (
                           <button className="btn btn-outline-success btn-sm focus:shadow-none me-2"
                                   title="View" onClick={() => push('/admin/hrm/roles/permissions/' + _id)}>
                               <FaPlus/>
                           </button>
                       )}

                   </>
                )}
                permission="role"
            />
        </>
    )
}
Roles.layout = UserLayout
export default Roles