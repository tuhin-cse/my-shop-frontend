import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useFetch} from "../../../helpers/hooks";
import {
    fetchTransactionReport,
    fetchTransactionReportElements,
    fetchTransactionReportRounds
} from "../../../helpers/backend_helper";
import {Form} from "antd";
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../../components/form/select";
import moment from "moment/moment";
import DateRange from "../../../components/form/date-range";
import {useI18n} from "../../../contexts/i18n";
import Button from "../../../components/common/button";
import ReportTable from "../../../components/common/report";
import {useState} from "react";

const SalesReport = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [elements] = useFetch(fetchTransactionReportElements)
    const [rounds, getRound] = useFetch(fetchTransactionReportRounds, {}, false)
    const [report, getReport, {loading, error}] = useFetch(fetchTransactionReport, {
        start: moment().startOf('month').toISOString(),
        end: moment().endOf('month').toISOString()
    })

    const [shop, setShop] = useState()
    const [card, setCard] = useState()
    const [project, setProject] = useState()
    const [round, setRound] = useState()
    const [date, setDate] = useState()

    let descriptions = []
    if (!!shop) {
        descriptions.push(`Shop: ${shop?.name}`)
    }
    if (!!project) {
        descriptions.push(`Project: ${project?.name}`)
    }
    if (!!round) {
        descriptions.push(`Round: ${round?.name}`)
    }
    if (!!card) {
        descriptions.push(`Card: ${card}`)
    }

    let columns = [
        {text: 'Bill No', dataField: 'ref'},
        {text: 'Shop', dataField: 'shop'},
        {text: 'Card Number', dataField: 'card'},
        {text: `${i18n.t('Project')} / ${i18n.t('Round')}`, dataField: 'project'},
        {text: 'Date', dataField: 'date'},
        {text: 'Order Tax', dataField: 'tax'},
        {text: 'Sub Total', dataField: 'subtotal'},
        {text: 'Paid', dataField: 'total'}
    ]

    return (
        <>
            <PageTitle title="Card Transaction Report"/>
            <ReportTable
                action={(
                    <Form form={form} layout="vertical" className="w-full" onFinish={values => {
                        getReport({
                            shop: values.shop || undefined,
                            project: values.project || undefined,
                            round: values.round || undefined,
                            card: !!card ? card?.replaceAll('-', '') : undefined,
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
                            {elements?.projects?.length > 0 && (
                                <>
                                    <Col md={3}>
                                        <FormSelect label="Project" name="project" options={elements?.projects}
                                                    onSelect={value => {
                                                        getRound({project: value})
                                                        setProject(elements?.projects?.find(d => d._id === value))
                                                    }} clearable/>
                                    </Col>
                                    <Col md={3}>
                                        <FormSelect label="Round" name="round" options={rounds}
                                                    onSelect={value => setRound(rounds?.find(d => d._id === value))}
                                                    clearable/>
                                    </Col>
                                </>
                            )}
                            <Col md={3}>
                                <div className="ant-col ant-form-item-label"><label>Card</label></div>
                                <input value={card} className="form-input" onChange={e => {
                                    let card = e?.target?.value?.replaceAll(/\D/g, '')
                                    setCard(card?.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`).join('').substring(0, 19))
                                }}/>
                            </Col>
                            <Col md={4}>
                                <Form.Item
                                    name="date"
                                    initialValue={{
                                        start: moment().startOf('month'),
                                        end: moment().endOf('month')
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
                    card: d?.card?.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`).join(''),
                    total: `$${d.total?.toFixed(2)}`,
                    subtotal: `$${d.subtotal?.toFixed(2)}`,
                }))}
                loading={loading}
                error={error}
                title="Card Transaction Report"
                date={date}
                descriptions={descriptions}
            />
        </>
    )
}
SalesReport.layout = UserLayout
export default SalesReport