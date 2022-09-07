import UserLayout from "../../../../layouts/user";
import PageTitle from "../../../../components/common/page-title";
import Button from "../../../../components/common/button";
import {delUser, fetchUsers} from "../../../../helpers/backend_helper";
import {useFetch} from "../../../../helpers/hooks";
import Table, {TableImage} from "../../../../components/common/table";
import {useRouter} from "next/router";

const Users = () => {
    const router = useRouter()
    const [users, getUsers, {loading, error}] = useFetch(fetchUsers)
    let columns = [
        {dataField: 'image', text: 'Image', formatter: image => <TableImage url={image || '/img/product.png'}/>},
        {dataField: 'name', text: 'Name', formatter: (_, {first_name, last_name}) => `${first_name} ${last_name}`},
        {dataField: 'email', text: 'Email'},
        {dataField: 'phone', text: 'Phone'},
        {
            dataField: 'roles',
            text: 'Roles',
            formatter: d => d?.map((d, index) => `${index > 0 ? ', ' : ''}${d?.name}`)
        },
        {
            dataField: 'active',
            text: 'Status',
            formatter: d => <span className={d ? 'text-blue-600' : 'text-red-600'}>{d ? 'Active' : 'Inactive'}</span>
        },
    ]
    let action = (
        <div>
            <Button
                onClick={() => router.push('/admin/hrm/users/add')}>Add User</Button>
        </div>
    )


    return (
        <>
            <PageTitle title="Users"/>
            <Table
                indexed
                columns={columns}
                data={users}
                loading={loading}
                error={error}
                action={action}
                onReload={getUsers}
                onDelete={delUser}
                onView={data => router.push('/admin/hrm/users/' + data._id)}
                onEdit={data => router.push('/admin/hrm/users/edit/' + data._id)}
                pagination
            />
        </>
    )
}
Users.layout = UserLayout
export default Users