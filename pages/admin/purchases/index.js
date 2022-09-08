import UserLayout, {havePermission} from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useUserContext} from "../../../contexts/user";
import {useAction, useActionConfirm, useFetch} from "../../../helpers/hooks";
import {fetchPurchaseElements, fetchPurchases, postPurchase, postPurchaseStatus} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import {FiCheck, FiEdit, FiX} from "react-icons/fi";
import {useRouter} from "next/router";
import {Form, Modal, Select} from "antd";
import {useState} from "react";
import FormInput, {HiddenFormItem} from "../../../components/form/input";
import Button from "../../../components/common/button";
import moment from "moment";

const Purchases = () => {
    const [form] = Form.useForm()
    const router = useRouter()
    const user = useUserContext()
    const manager = havePermission('purchase_management', user?.roles)
    const admin = havePermission('site_admin', user?.roles)
    const [elements] = useFetch(fetchPurchaseElements)
    const [purchases, getPurchases, {loading}] = useFetch(fetchPurchases)
    const [visible, setVisible] = useState(false)

    let status = {
        "pending": 'btn btn-warning btn-sm text-capitalize text-white',
        "accepted": 'btn btn-primary btn-sm text-capitalize text-white',
        "completed": 'btn btn-success btn-sm text-capitalize text-white',
        "cancelled": 'btn btn-danger btn-sm text-capitalize text-white'
    }

    const columns = [
        {dataField: 'ref', text: 'Ref', formatter: d => `P-${d.toString().padStart(3, '0')}`},
        {dataField: 'shop', text: 'Shop'},
        {dataField: 'company', text: 'Company'},
        {dataField: 'product', text: 'Product'},
        {dataField: 'price', text: 'Price', formatter: d => d?.toFixed(2)},
        {dataField: 'quantity', text: 'Quantity'},
    ]
    columns.push({dataField: 'total', text: 'Total', formatter: d => d?.toFixed(2)})
    if (admin || !manager) {
        columns.push({
            dataField: 'credit_charge',
            text: 'Credit Charge',
            formatter: (d, data) => data.method === 'credit' && data.credit_status === 'accepted' ? d?.toFixed(2) : '-'
        })
    }
    if (admin || manager) {
        columns.push({dataField: 'total_fee', text: 'fee', formatter: d => d?.toFixed(2)})
    }
    columns.push({dataField: 'method', text: 'Method', className: 'text-capitalize'})
    columns.push({
        dataField: 'order_status',
        text: 'Status',
        formatter: d => <button className={status[d] || ''}>{d}</button>
    })

    return (
        <>
            <PageTitle title="Purchases"/>
            <Modal visible={visible} onCancel={() => setVisible(false)} title={'Update Purchase'} footer={null}>
                <Form layout="vertical" form={form} onFinish={values => {
                    setVisible(false)
                    return useAction(postPurchase, {
                        ...values,
                        delivery_date: values.delivery_date.format('YYYY-MM-DD')
                    }, () => getPurchases())
                }}>
                    <HiddenFormItem name="_id"/>
                    <FormInput name="quantity" label="Quantity" type="number" required/>
                    <FormInput name="delivery_date" label="Delivery Date" type="date"
                               disabledDate={current => current.valueOf() < Date.now()} required/>
                    <FormInput name="note" label="Note" textArea required/>
                    <Button>Submit</Button>
                </Form>
            </Modal>
            <Table
                columns={columns}
                data={purchases}
                onReload={getPurchases}
                title={(
                    <div className="flex flex-wrap">
                        {elements?.shops?.length > 0 && (
                            <Select
                                className="w-44 select-38 me-3"
                                placeholder={'Shop'}
                                onClear={() => {
                                    getPurchases({shop: undefined})
                                }}
                                onSelect={value => {
                                    getPurchases({shop: value})
                                }}
                                options={elements?.shops?.map(d => ({label: d?.name, value: d._id}))} allowClear/>
                        )}
                        {elements?.companies?.length > 0 && (
                            <Select
                                className="w-44 select-38 me-3"
                                placeholder={'Company'}
                                onClear={() => {
                                    getPurchases({company: undefined})
                                }}
                                onSelect={value => {
                                    getPurchases({company: value})
                                }}
                                options={elements?.companies?.map(d => ({label: d?.name, value: d._id}))}
                                allowClear/>
                        )}
                    </div>
                )}
                loading={loading}
                onView={({_id}) => router.push('/admin/purchases/' + _id)}
                actions={data => (
                    <div className="inline-block me-2">
                        {((!!manager && data.buyer_status === 'accepted' && data.order_status === 'pending') ||
                            (!manager && !admin && data.buyer_status === 'pending' && (data.method !== 'credit' || data.credit_status === 'accepted')
                            )) && (
                            <button
                                onClick={() =>
                                    useActionConfirm(
                                        postPurchaseStatus,
                                        {_id: data._id, status: 'accepted'},
                                        () => getPurchases(),
                                        "Are you sure want to accept the purchase?",
                                        'Yes, Accept',
                                        i18n.t
                                    )
                                }
                                className="btn btn-success btn-sm"
                            ><FiCheck/>
                            </button>
                        )}
                        {(!!manager) && (
                            <>
                                {((data.order_status === 'pending' || data.order_status === 'accepted') && data.buyer_status === 'accepted') && (
                                    <button
                                        onClick={() => {
                                            setVisible(true)
                                            form.resetFields()
                                            form.setFieldsValue({
                                                ...data,
                                                delivery_date: moment(data.delivery_date, 'YYYY-MM-DD')
                                            })
                                        }}
                                        className="btn btn-primary btn-sm ms-2"
                                    ><FiEdit/></button>
                                )}
                            </>
                        )}

                        {((!!manager && data.buyer_status === 'accepted' && data.order_status === 'pending') ||
                            (!manager && !admin && data.buyer_status === 'pending' && (data.method !== 'credit' || data.credit_status === 'accepted')
                            )) && (
                            <button
                                onClick={() =>
                                    useActionConfirm(
                                        postPurchaseStatus,
                                        {_id: data._id, status: 'cancelled'},
                                        () => getPurchases(),
                                        "Are you sure want cancel the purchase?",
                                        'Yes, Cancel',
                                    )
                                }
                                className="btn btn-danger btn-sm ms-2"
                            ><FiX/></button>
                        )}
                        {(!manager && !admin && data.order_status === 'accepted') && (
                            <>
                                <button
                                    onClick={() =>
                                        useActionConfirm(
                                            postPurchaseStatus,
                                            {_id: data._id, status: 'completed'},
                                            () => getPurchases(),
                                            "Are you sure want to accept the purchase?",
                                            'Yes, Accept',
                                        )
                                    }
                                    className="btn btn-success btn-sm"
                                >{"Complete"}
                                </button>
                            </>
                        )}
                    </div>
                )}
                indexed
                pagination
            />
        </>
    )
}
Purchases.layout = UserLayout
export default Purchases