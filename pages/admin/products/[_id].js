import PageTitle from "../../../components/common/page-title";
import UserLayout from "../../../layouts/user";
import {useFetch} from "../../../helpers/hooks";
import {fetchProduct} from "../../../helpers/backend_helper";
import {useRouter} from "next/router";
import Card from "../../../components/common/card";
import {Col, Row} from "react-bootstrap";
import DetailsTable from "../../../components/common/deatils";

const Product = () => {
    const {query} = useRouter()
    const [product] = useFetch(fetchProduct, {_id: query._id})


    const columns = [
        {label: 'Product Name', dataField: 'name'},
        {
            dataField: 'categories',
            label: 'Categories',
            formatter: d => d?.map((d, index) => `${index > 0 ? ', ' : ''}${d?.name}`)
        },
        {
            dataField: 'sub_categories',
            label: 'Sub Categories',
            formatter: d => d?.map((d, index) => `${index > 0 ? ', ' : ''}${d?.name}`) || '-'
        },
        {label: 'Quantity', dataField: 'quantity'},
        {label: 'Quantity Type', dataField: 'unit'},
        {
            dataField: 'active',
            label: 'Status',
            formatter: d => <span className={d ? 'text-blue-600' : 'text-red-600'}>{d ? 'Active' : 'Inactive'}</span>
        },
        {label: 'Product Barcode', dataField: 'code'},
        {label: 'Description', dataField: 'description'},
    ]


    return (
        <>
            <PageTitle
                title="Product Details"/>
            <Card>
                <Row>
                    <Col sm={8}>
                        <DetailsTable columns={columns} data={product || {}}/>
                    </Col>
                    <Col sm={4}>
                        <img className="mx-auto" style={{maxWidth: '100%', maxHeight: 300}} src={product?.image || '/img/product.png'} alt=""/>
                    </Col>
                </Row>
            </Card>
        </>
    )
}
Product.layout = UserLayout
export default Product