import PageTitle from "../../../../components/common/page-title";
import UserLayout from "../../../../layouts/user";
import {useFetch} from "../../../../helpers/hooks";
import {fetchUser} from "../../../../helpers/backend_helper";
import {useRouter} from "next/router";
import Card from "../../../../components/common/card";
import {Col, Row} from "react-bootstrap";
import DetailsTable from "../../../../components/common/deatils";

const Product = () => {
    const {query} = useRouter()
    const [user] = useFetch(fetchUser, {_id: query._id})


    const columns = [
        {
            label: 'Name',
            dataField: 'name',
            formatter: (_, {first_name, last_name}) => `${first_name || ''} ${last_name || ''}`
        },
        {label: 'Email', dataField: 'email'},
        {label: 'Username', dataField: 'username'},
        {label: 'Phone', dataField: 'phone'},
        {
            label: 'Address',
            dataField: 'address',
            formatter: (_, d) => `${d?.building || ''} ${d?.street || ''} ${d?.area || ''}, ${d?.city || ''},  ${d?.country || ''}`
        },

        {
            dataField: 'roles',
            label: 'Roles',
            formatter: d => d?.map((d, index) => `${index > 0 ? ', ' : ''}${d?.name}`) || '-'
        },
        {
            dataField: 'active',
            label: 'Status',
            formatter: d => <span className={d ? 'text-blue-600' : 'text-red-600'}>{d ? 'Active' : 'Inactive'}</span>
        },
    ]


    return (
        <>
            <PageTitle
                title="User Details"/>
            <Card>
                <Row>
                    <Col sm={8}>
                        <DetailsTable columns={columns} data={user || {}}/>
                    </Col>
                    <Col sm={4}>
                        <img className="mx-auto" style={{maxWidth: '100%', maxHeight: 300}}
                             src={user?.image || '/img/profile.png'} alt=""/>
                    </Col>
                </Row>
            </Card>
        </>
    )
}
Product.layout = UserLayout
export default Product