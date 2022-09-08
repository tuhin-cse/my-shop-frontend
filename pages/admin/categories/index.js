import {useFetch} from "../../../helpers/hooks";
import {delCategory, fetchCategories} from "../../../helpers/backend_helper";
import Button from "../../../components/common/button";
import PageTitle from "../../../components/common/page-title";
import Table, {TableImage} from "../../../components/common/table";
import UserLayout from "../../../layouts/user";
import {useRouter} from "next/router";

const Categories = () => {
    const router = useRouter()

    const [categories, getCategories, {loading, error}] = useFetch(fetchCategories)
    let columns = [
        {dataField: 'image', text: 'Image', formatter: d => <TableImage url={d}/>},
        {dataField: 'name', text: 'Name'},
        {
            dataField: 'active',
            text: 'Status',
            formatter: d => <span className={d ? 'text-blue-600' : 'text-red-600'}>{d ? 'Active' : 'Inactive'}</span>
        },
    ]
    let action = <Button
        onClick={() => {
            router.push('/admin/categories/add')
        }}>Add Category</Button>

    return (
        <>
            <PageTitle title="Categories"/>
            <Table
                indexed
                columns={columns}
                data={categories}
                loading={loading}
                error={error}
                action={action}
                onReload={getCategories}
                onDelete={delCategory}
                onEdit={({_id}) => {
                    router.push('/admin/categories/edit/' + _id)
                }}
                permission="category"
            />
        </>
    )
}
Categories.layout = UserLayout
export default Categories