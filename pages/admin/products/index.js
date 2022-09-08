import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import Button from "../../../components/common/button";
import {delProduct, fetchCategories, fetchProducts} from "../../../helpers/backend_helper";
import {useFetch} from "../../../helpers/hooks";
import Table, {TableImage} from "../../../components/common/table";
import {useRouter} from "next/router";
import {Select} from "antd";

const Products = () => {
    const router = useRouter()
    const [categories] = useFetch(fetchCategories)
    const [products, getProducts, {loading, error}] = useFetch(fetchProducts)
    let columns = [
        {dataField: 'image', text: 'Image', formatter: image => <TableImage url={image || '/img/product.png'}/>},
        {dataField: 'name', text: 'Name'},
        {dataField: 'code', text: 'Barcode'},
        {
            dataField: 'categories',
            text: 'Categories',
            formatter: d => d?.map((d, index) => `${index > 0 ? ', ' : ''}${d?.name}`)
        },
        {
            dataField: 'sub_categories',
            text: 'Sub Categories',
            formatter: d => d?.map((d, index) => `${index > 0 ? ', ' : ''}${d?.name}`) || '-'
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
                onClick={() => router.push('/admin/products/add')}>Add Product</Button>
        </div>
    )


    return (
        <>
            <PageTitle title="Products" breadcrumbs={[{label: 'Dashboard', href: '/'}, {label: 'Products'}]}/>
            <Table
                indexed
                columns={columns}
                data={products}
                loading={loading}
                afterSearch={(
                    <>
                        <Select
                            className="w-44 select-38 me-3"
                            placeholder={'Category'}
                            onClear={() => {
                                getProducts({category: undefined})
                            }}
                            onSelect={value => {
                                getProducts({category: value})
                            }}
                            options={categories?.map(d => ({label: d?.name, value: d._id}))} allowClear/>
                        <Select
                            className="w-44 select-38 me-3"
                            placeholder={'Status'}
                            onClear={() => {
                                getProducts({status: undefined})
                            }}
                            onSelect={value => {
                                getProducts({status: value})
                            }}
                            options={[{label: 'Active', value: true}, {
                                label: 'Inactive',
                                value: false
                            }]}
                            allowClear/>
                    </>
                )}
                error={error}
                action={action}
                onReload={getProducts}
                onDelete={delProduct}
                onView={data => router.push('/admin/products/' + data._id)}
                onEdit={data => router.push('/admin/products/edit/' + data._id)}
                permission="product"
                pagination
            />
        </>
    )
}
Products.layout = UserLayout
export default Products