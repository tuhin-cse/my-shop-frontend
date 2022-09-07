import {useFetch} from "../../../helpers/hooks";
import {delCategory, fetchCategories, fetchCategory} from "../../../helpers/backend_helper";
import Button from "../../../components/common/button";
import PageTitle from "../../../components/common/page-title";
import Table, {TableImage} from "../../../components/common/table";
import UserLayout from "../../../layouts/user";
import {useRouter} from "next/router";
import {useI18n} from "../../../contexts/i18n";

const Categories = () => {
    const i18n = useI18n()
    const router = useRouter()
    const [category] = useFetch(fetchCategory, {_id: router.query._id})
    const [categories, getCategories, {loading, error}] = useFetch(fetchCategories, {parent: router.query._id})
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
            router.push('/admin/categories/add?parent=' + category._id)
        }}>{i18n.t("Add Sub Category")}</Button>

    return (
        <>
            <PageTitle title={`${i18n.t("Sub Categories")} ${category?.name || ''}`}/>
            <Table
                indexed
                columns={columns}
                data={categories}
                loading={loading}
                error={error}
                action={action}
                onReload={getCategories}
                onDelete={delCategory}
                onEdit={data => {
                    router.push(`/admin/categories/edit/${data._id}?parent=` + category._id)
                }}
                permission="category"
            />
        </>
    )
}
Categories.layout = UserLayout
export default Categories