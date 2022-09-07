import UserLayout, {havePermission} from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useAction, useActionConfirm, useFetch} from "../../../helpers/hooks";
import {fetchPurchase, postPurchase, postPurchaseStatus} from "../../../helpers/backend_helper";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";
import DetailsTable from "../../../components/common/deatils";
import Card from "../../../components/common/card";
import {useEffect, useState} from "react";
import {FiCheck, FiEdit, FiPrinter, FiX} from "react-icons/fi";
import moment from "moment/moment";
import {useI18n} from "../../../contexts/i18n";
import {useUserContext} from "../../../contexts/user";
import {Form, Modal} from "antd";
import FormInput, {HiddenFormItem} from "../../../components/form/input";
import Button from "../../../components/common/button";

const Purchase = () => {
    const [form] = Form.useForm()
    const i18n = useI18n()
    let {query} = useRouter()
    const user = useUserContext()
    const manager = havePermission('purchase_management', user?.roles)
    const admin = havePermission('site_admin', user?.roles)
    const [visible, setVisible] = useState(false)

    const [purchase, getPurchase] = useFetch(fetchPurchase, {}, false)
    useEffect(() => {
        getPurchase(query)
    }, [query])

    let status = {
        "pending": 'btn btn-warning btn-sm text-capitalize text-white',
        "accepted": 'btn btn-primary btn-sm text-capitalize text-white',
        "completed": 'btn btn-success btn-sm text-capitalize text-white',
        "cancelled": 'btn btn-danger btn-sm text-capitalize text-white'
    }

    const columns = [
        {label: 'Product Name', dataField: 'product', formatter: d => d?.product?.name},
        {label: 'Shop', dataField: 'shop', formatter: d => d?.name},
        {label: 'Company', dataField: 'product', formatter: d => d?.company?.name},
        {label: 'Quantity', dataField: 'quantity'},
        {label: 'Price', dataField: 'price', formatter: d => d?.toFixed(2)},
        {label: 'Sub Total', dataField: 'total', formatter: d => d?.toFixed(2)},
        {
            dataField: 'order_status',
            label: 'Status',
            formatter: d => <button className={status[d] || ''}>{d}</button>
        },
        {label: 'Delivery Date', dataField: 'delivery_date'},
    ]
    if (admin || manager) {
        columns.push({dataField: 'total_fee', label: 'Fee', formatter: d => d?.toFixed(2)})
    }
    if (!manager && purchase?.method === 'credit') {
        columns.push({
            dataField: 'credit_status',
            label: 'Credit Status',
            formatter: d => <button className={status[d] || ''}>{d}</button>
        })
        columns.push({
            dataField: 'credit_charge',
            label: 'Credit Charge',
            formatter: d => d?.toFixed(2)
        })
    }
    columns.push({label: 'Note', dataField: 'note'},)
    if (purchase?.order_status === 'cancelled') {
        columns.push({label: 'Cancel Reason', dataField: 'reject_msg'},)
    }

    const columns2 = [
        {label: 'Country', dataField: 'country'},
        {label: 'City', dataField: 'city'},
        {label: 'Area', dataField: 'area'},
        {label: 'Street', dataField: 'street'},
        {label: 'Building', dataField: 'building'},
        {label: 'Door', dataField: 'door'},
    ]

    return (
        <>
            <PageTitle title="Purchase Details"/>
            <Modal visible={visible} onCancel={() => setVisible(false)} title={i18n.t('Update Purchase')} footer={null}>
                <Form layout="vertical" form={form} onFinish={values => {
                    setVisible(false)
                    return useAction(postPurchase, {
                        ...values,
                        delivery_date: values.delivery_date.format('YYYY-MM-DD')
                    }, () => getPurchase())
                }}>
                    <HiddenFormItem name="_id"/>
                    <FormInput name="quantity" label="Quantity" type="number" required/>
                    <FormInput name="delivery_date" label="Delivery Date" type="date"
                               disabledDate={current => current.valueOf() < Date.now()} required/>
                    <FormInput name="note" label="Note" textArea required/>
                    <Button>Submit</Button>
                </Form>
            </Modal>


            <Card>
                <Row>
                    <Col sm={8}>
                        <DetailsTable columns={columns} data={purchase || {}}/>
                        {purchase?.home_delivery && (
                            <>
                                <h5 className="mb-2">Delivery Details</h5>
                                <DetailsTable columns={columns2} data={purchase?.location || {}}/>
                            </>
                        )}
                    </Col>
                    <Col sm={4}>
                        <div className="flex justify-end">
                            {((!!manager && purchase?.buyer_status === 'accepted' && purchase?.order_status === 'pending') ||
                                (!manager && !admin && purchase?.buyer_status === 'pending' && (purchase?.method !== 'credit' || purchase?.credit_status === 'accepted')
                                )) && (
                                <button
                                    onClick={() =>
                                        useActionConfirm(
                                            postPurchaseStatus,
                                            {_id: purchase?._id, status: 'accepted'},
                                            () => getPurchase(),
                                            "Are you sure want to accept the purchase?",
                                            'Yes, Accept',
                                            i18n.t
                                        )
                                    }
                                    className="btn btn-success"
                                ><FiCheck className="inline-block"/> Accept
                                </button>
                            )}
                            {(!!manager) && (
                                <>
                                    {((purchase?.order_status === 'pending' || purchase?.order_status === 'accepted') && purchase?.buyer_status === 'accepted') && (
                                        <button
                                            onClick={() => {
                                                setVisible(true)
                                                form.resetFields()
                                                form.setFieldsValue({
                                                    ...purchase,
                                                    delivery_date: moment(purchase?.delivery_date, 'YYYY-MM-DD')
                                                })
                                            }}
                                            className="btn btn-primary ms-2"
                                        ><FiEdit className="inline-block"/> Edit
                                        </button>
                                    )}
                                </>
                            )}

                            {((!!manager && purchase?.buyer_status === 'accepted' && purchase?.order_status === 'pending') ||
                                (!manager && !admin && purchase?.buyer_status === 'pending' && (purchase?.method !== 'credit' || purchase?.credit_status === 'accepted')
                                )) && (
                                <button
                                    onClick={() =>
                                        useActionConfirm(
                                            postPurchaseStatus,
                                            {_id: purchase?._id, status: 'cancelled'},
                                            () => getPurchase(),
                                            "Are you sure want cancel the purchase?",
                                            'Yes, Cancel',
                                            i18n.t
                                        )
                                    }
                                    className="btn btn-danger ms-2"
                                ><FiX className="inline-block"/> Cancel
                                </button>
                            )}

                            {(!manager && !admin && purchase?.order_status === 'accepted') && (
                                <>
                                    <button
                                        onClick={() =>
                                            useActionConfirm(
                                                postPurchaseStatus,
                                                {_id: purchase?._id, status: 'completed'},
                                                () => getPurchase(),
                                                "Are you sure want to accept the purchase?",
                                                'Yes, Accept',
                                                i18n.t
                                            )
                                        }
                                        className="btn btn-success"
                                    >{i18n.t("Complete")}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    handlePurchaseInvoicePrint()
                                }}
                                className="btn btn-success ms-2"
                            ><FiPrinter className="inline-block"/> Print
                            </button>
                        </div>
                        <img className="mx-auto" style={{maxWidth: '100%', maxHeight: 300}}
                             src={purchase?.product?.product?.image || '/img/product.png'} alt=""/>
                    </Col>
                </Row>
            </Card>
            <PurchaseInvoiceDetails invoice={purchase} credit={!manager && purchase?.method === 'credit'}/>
        </>
    )
}
Purchase.layout = UserLayout
export default Purchase


export const PurchaseInvoiceDetails = ({invoice, credit = false}) => {
    const i18n = useI18n()
    return (
        <>
            <div id="purchase-print-content" className="hidden">
                <div style={{maxWidth: 300, overflow: "hidden"}}>
                    <div className="text-center">
                        <img src={invoice?.product?.company?.logo}
                             style={{height: 40, display: 'inline-block', marginBottom: 4}} alt=""/>
                    </div>
                    <h4 style={{fontSize: 16, textAlign: 'center', margin: 2}}>{invoice?.product?.company?.name}</h4>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <p className="text-sm">{i18n.t("Shop Name")} : {invoice?.shop?.name}</p>
                            <p className="text-sm">{i18n.t("Purchase No")}:
                                #{invoice?.ref?.toString().padStart(4, '0')}</p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <p className="text-sm">{i18n.t("Date")}: {moment(invoice?.createdAt).format('YYYY-MM-DD')}</p>
                            <p className="text-sm">{i18n.t("Deliver")}: {invoice?.delivery_date}</p>
                        </div>
                    </div>
                    <hr/>
                    <div style={{marginBottom: 4}}></div>
                    <div>
                        <p className="text-sm" style={{marginBottom: 2}}>{invoice?.product?.product?.name}</p>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <p className="text-sm"
                               style={{marginBottom: 2}}>{invoice?.quantity} x {invoice?.price}</p>
                            <p className="text-sm"
                               style={{marginBottom: 2}}>$ {invoice?.total?.toFixed(2)}</p>
                        </div>
                        <hr/>
                    </div>
                    {credit && (
                        <>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm"
                                   style={{marginBottom: 2}}>Credit Charge</p>
                                <p className="text-sm"
                                   style={{marginBottom: 2}}>$ {invoice?.credit_charge?.toFixed(2)}</p>
                            </div>
                            <hr/>
                        </>
                    )}
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-sm text-bold"
                        >{i18n.t("Total")}</p>
                        <p className="text-sm text-bold">$ {((credit ? invoice?.total + invoice?.credit_charge : invoice?.total) || 0)?.toFixed(2)}</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-sm text-bold"
                        >{i18n.t("Method")}</p>
                        <p className="text-sm text-bold">{invoice?.method}</p>
                    </div>
                </div>
            </div>
            <iframe id="print-frame" className="hidden">
            </iframe>
        </>
    )
}

export const handlePurchaseInvoicePrint = () => {
    let body = document.querySelector('#purchase-print-content').innerHTML;
    let frame = window.frames['print-frame'].contentWindow
    frame.document.head.innerHTML = `
        <style>    
        table, th, td {
            font-size: 12px;
            border-collapse: collapse;
            min-width: 60px;
            text-align: left;
            padding: 10px 0;
        }
        table {
            width: 100%;
            padding: 5px;
        }
        table table {
            border: none;
        }
        th {
            padding: 5px;
        }
        td {
            padding: 5px;
        }
        .hide-report {
            display: none;
        }
        .print-btn {
            display: none;
        }
        p {
            margin: 0;
        }
        hr {
          margin: 0;
          padding: 0;
          border: 1px solid #fff;
          height:3px;
        }
        hr:after {
            position: absolute;
            content:"..................................................";
            letter-spacing: 3px;
            color: rgba(0,0,0, .25);
             margin-top: -10px;
             font-size: 12px;
             width: 100%;
          
             overflow: hidden;
        }
        body { margin: 1.6cm; position: relative }
        @media print {
            @page { margin: 0}
            body { margin: 15px }
        }
        .text-xs {
            font-size: 11px;
        }
        .text-sm {
            font-size: 12px;
        }
        .text-center {
            text-align: center;
        }
        .text-bold {
            font-weight: 700;
        }
        
        .mb-2 {
        margin-bottom: 4px;
        }
        
        * {
    -webkit-print-color-adjust: exact !important;   /* Chrome, Safari, Edge */
    color-adjust: exact !important;                 /*Firefox*/
}
        
        </style>
        `
    frame.document.body.innerHTML = body
    window.setTimeout(() => {
        frame.print();
    }, 300)
}