import UserLayout, {havePermission} from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useFetch} from "../../../helpers/hooks";
import {fetchPurchaseElements, fetchPurchaseReport} from "../../../helpers/backend_helper";
import {Form} from "antd";
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../../components/form/select";
import moment from "moment/moment";
import DateRange from "../../../components/form/date-range";
import {useI18n} from "../../../contexts/i18n";
import Button from "../../../components/common/button";
import ReportTable from "../../../components/common/report";
import {useState} from "react";
import {useUserContext} from "../../../contexts/user";

const PurchasesReport = () => {
    const i18n = useI18n()
    const [elements] = useFetch(fetchPurchaseElements)
    const [report, getReport, {loading, error}] = useFetch(fetchPurchaseReport, {}, false)

    const [shop, setShop] = useState()
    const [date, setDate] = useState()

    const user = useUserContext()
    const manager = havePermission('purchase_management', user?.roles)
    const admin = havePermission('site_admin', user?.roles)

    let columns = [
        {text: 'Bill No', dataField: 'ref'},
        {text: 'Product', dataField: 'product'},
        {text: 'Date', dataField: 'date'},
        {text: 'Status', dataField: 'order_status'},
        {text: 'Method', dataField: 'method'},
        {text: 'Price', dataField: 'price'},
        {text: 'Quantity', dataField: 'quantity'},
        {text: 'Total', dataField: 'total'},
        {text: 'Credit Charge', dataField: 'credit_charge'},
    ]

    if (admin || manager) {
        columns.push({dataField: 'total_fee', text: 'Fee'})
    }

    return (
        <>
            <PageTitle title="Purchases Report"/>
            <ReportTable
                action={(
                    <Form layout="vertical" className="w-full" onFinish={values => {
                        getReport({
                            status: values.status,
                            shop: values.shop,
                            start: values.date.start?.startOf('day').toISOString(),
                            end: values.date.end?.endOf('day').toISOString()
                        })
                    }}>
                        <Row>
                            {elements?.shops?.length > 0 && (
                                <Col md={3}>
                                    <FormSelect label="Shop" name="shop" options={elements?.shops}
                                                onSelect={value => setShop(elements?.shops?.find(d => d._id === value))}
                                                clearable/>
                                </Col>
                            )}
                            {elements?.companies?.length > 0 && (
                                <Col md={3}>
                                    <FormSelect label="Company" name="company" options={elements?.companies}
                                                onSelect={value => setShop(elements?.companies?.find(d => d._id === value))}
                                                clearable/>
                                </Col>
                            )}
                            <Col md={3}>
                                <FormSelect
                                    label="Status"
                                    name="status"
                                    options={[
                                        {label: 'Pending', value: 'pending'},
                                        {label: 'Accepted', value: 'accepted'},
                                        {label: 'Completed', value: 'completed'},
                                        {label: 'Cancelled', value: 'cancelled'}
                                    ]} clearable/>
                            </Col>
                            <Col md={4}>
                                <Form.Item
                                    name="date"
                                    initialValue={{
                                        start: moment(),
                                        end: moment()
                                    }} label={i18n.t("Date")}
                                    rules={[
                                        {required: true, message: 'Please select date'},
                                    ]}>
                                    <DateRange left={true} onChange={setDate}/>
                                </Form.Item>
                            </Col>
                            <Col md={2} className="pt-7">
                                <Button>Get Report</Button>
                            </Col>
                        </Row>
                    </Form>
                )}
                columns={columns}
                data={(report || [])?.map(d => ({
                    ...d,
                    date: moment(d.date).format('Do MMM, YYYY hh:mm A'),
                    total: `$${d.total?.toFixed(2)}`,
                    credit_charge: d.method === 'credit' ? `$${d.credit_charge?.toFixed(2)}` : '-',
                    price: `$${d.price?.toFixed(2)}`,
                    total_fee: `$${(d.total_fee || 0)?.toFixed(2)}`,
                }))}
                loading={loading}
                title="Purchases Report"
                subtitle={`Shop: ${shop?.name || ''}`}
                customRows={(
                    <>
                        {report && (
                            <tr>
                                <td colSpan={7} style={{textAlign: "right", paddingRight: 20}}>Total</td>
                                <td>$ {report?.reduce((acc, d) => acc + (d?.total || 0), 0).toFixed(2)}</td>
                                <td>$ {report?.reduce((acc, d) => acc + (d?.credit_charge || 0), 0).toFixed(2)}</td>
                                {(admin || manager) && (
                                    <td>$ {report?.reduce((acc, d) => acc + (d?.total_fee || 0), 0).toFixed(2)}</td>
                                )}
                            </tr>
                        )}
                    </>
                )}
                date={date}
                error={error}
            />
        </>
    )
}
PurchasesReport.layout = UserLayout
export default PurchasesReport