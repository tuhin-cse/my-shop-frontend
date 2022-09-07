import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useFetch} from "../../../helpers/hooks";
import {fetchSaleReport, fetchSaleReportShops} from "../../../helpers/backend_helper";
import {Form} from "antd";
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../../components/form/select";
import moment from "moment/moment";
import DateRange from "../../../components/form/date-range";
import {useI18n} from "../../../contexts/i18n";
import Button from "../../../components/common/button";
import ReportTable from "../../../components/common/report";
import {useState} from "react";
import {formatCard} from "../hrm/cards";

const SalesReport = () => {
    const i18n = useI18n()
    const [shops] = useFetch(fetchSaleReportShops)
    const [report, getReport, {loading, error}] = useFetch(fetchSaleReport, {}, false)

    const [shop, setShop] = useState()
    const [date, setDate] = useState()

    let columns = [
        {text: 'Bill No', dataField: 'ref'},
        {text: 'Card Number', dataField: 'card'},
        {text: 'Date', dataField: 'date'},
        {text: 'Order Tax', dataField: 'tax'},
        {text: 'Total', dataField: 'total'},
        {text: 'Paid', dataField: 'paid'},
        {text: 'Fee', dataField: 'fee'}
    ]

    return (
        <>
            <PageTitle title="Sales Report"/>
            <ReportTable
                action={(
                    <Form layout="vertical" className="w-full" onFinish={values => {
                        getReport({
                            shop: values.shop,
                            start: values.date.start?.startOf('day').toISOString(),
                            end: values.date.end?.endOf('day').toISOString()
                        })
                    }}>
                        <Row>
                            <Col md={4}>
                                <FormSelect label="Shop" name="shop" options={shops}
                                            onSelect={value => setShop(shops?.find(d => d._id === value))} required/>
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
                    card: formatCard(d.card),
                    tax: `$${d.tax}`,
                    total: `$${d.total?.toFixed(2)}`,
                    paid: `$${d.paid?.toFixed(2)}`,
                    fee: `$${d.fee?.toFixed(2)}`,
                }))}
                loading={loading}
                error={error}
                title="Sales Report"
                subtitle={`Shop: ${shop?.name || ''}`}
                customRows={(
                    <>
                        {report && (
                            <tr>
                                <td colSpan={4} style={{textAlign: "right", paddingRight: 20}}>Total</td>
                                <td>$ {report?.reduce((acc, d) => acc + (d?.total || 0), 0).toFixed(2)}</td>
                                <td>$ {report?.reduce((acc, d) => acc + (d?.paid || 0), 0).toFixed(2)}</td>
                                <td>$ {report?.reduce((acc, d) => acc + (d?.fee || 0), 0).toFixed(2)}</td>
                            </tr>
                        )}
                    </>
                )}
                date={date}
            />
        </>
    )
}
SalesReport.layout = UserLayout
export default SalesReport