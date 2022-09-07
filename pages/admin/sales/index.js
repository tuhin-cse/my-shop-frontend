import UserLayout from "../../../layouts/user";
import {delSell, fetchInvoiceSettings, fetchSellInvoice, fetchSells} from "../../../helpers/backend_helper";
import {useAction, useFetch} from "../../../helpers/hooks";
import Button from "../../../components/common/button";
import {useRouter} from "next/router";
import Table from "../../../components/common/table";
import PageTitle from "../../../components/common/page-title";
import moment from "moment";
import {FaPrint} from "react-icons/fa";
import {useState} from "react";

const Sales = () => {
    const router = useRouter()
    const [sales, getSales, {loading, error}] = useFetch(fetchSells)

    let columns = [
        {dataField: 'date', text: 'Date'}, {dataField: 'ref', text: 'Ref'},
        {dataField: 'created_at', text: 'Time', formatter: d => moment(d).format('hh:mm A')},
        {dataField: 'customer', text: 'Customer', formatter: d => d?.name || '-'},
        {dataField: 'customer', text: 'Contact', formatter: d => d?.phone || '-'},
        {dataField: 'grand_total', text: 'G. Total'},
        {dataField: 'total_paid', text: 'Paid'},
        {dataField: 'due_amount', text: 'Due'},
        {
            dataField: 'payment_status',
            text: 'Status',
            formatter: status => <button
                className={`btn ${status === 'Paid' ? 'btn-success' : status === 'Partial' ? 'btn-primary' : 'btn-danger'} btn-sm`}>{status}</button>
        },
    ]


    const [invoice, setInvoice] = useState()
    const [settings] = useFetch(fetchInvoiceSettings)

    let action = <Button
        onClick={() => router.push('/admin/sales/add')}>Add Sale</Button>

    return (
        <>
            <PageTitle title="Sales" breadcrumbs={[{label: 'Dashboard', href: '/'}, {label: 'Sales'}]}/>
            <Table
                indexed
                columns={columns}
                data={sales}
                loading={loading}
                error={error}
                action={action}
                onReload={getSales}
                onDelete={delSell}
                pagination
                actions={(data => {
                    return (
                        <button className="btn btn-outline-secondary btn-sm focus:shadow-none me-2"
                                title="Print" onClick={() => useAction(fetchSellInvoice, {id: data.id}, (data) => {
                            setInvoice(data)
                            window.setTimeout(() => {
                                handleInvoicePrint()
                            }, 500)
                        }, false)}>
                            <FaPrint/>
                        </button>
                    )
                })}
                onView={data => router.push('/sales/' + data.id)}
                onEdit={data => router.push('/sales/edit/' + data.id)}
                actionPermission="sale_pos"
                editPermission="sale_update"
                deletePermission="sale_delete"
            />
            <InvoiceDetails invoice={invoice} settings={settings}/>
        </>
    )
}
Sales.layout = UserLayout
export default Sales


export const InvoiceDetails = ({invoice, settings}) => {
    const isFull = +settings?.is_pos_print !== 1

    return (
        <>
            <div id="print-content" className="hidden">
                <div style={{maxWidth: isFull ? undefined : 300, overflow: "hidden"}}>
                    {invoice?.business?.logo && (
                        <div className="text-center">
                            <img src={invoice?.business?.logo}
                                 style={{height: 40, display: 'inline-block', marginBottom: 4}} alt=""/>
                        </div>
                    )}
                    <h4 style={{fontSize: 16, textAlign: 'center', margin: 2}}>{invoice?.business?.name}</h4>
                    <p style={{fontSize: 12, textAlign: 'center', marginBottom: 2}}>{settings?.title}</p>
                    <p className="text-xs text-center" style={{marginBottom: 2}}>{invoice?.business?.address}</p>
                    <p className="text-sm text-center mb-2">{invoice?.business?.phone}, {invoice?.business?.email}</p>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-sm">Date: {invoice?.date}</p>
                        <p className="text-sm">Time: {moment(invoice?.time).format('hh:mm A')}</p>
                    </div>
                    <p className="text-sm">Invoice No: {invoice?.ref}</p>
                    {invoice?.customer?.name && <p className="text-sm">Customer: {invoice?.customer?.name}</p>}
                    {isFull ? (
                        <>
                            <div style={{marginBottom: 8}}></div>
                            <table className="table">
                                <thead>
                                <tr style={{borderTop: '1px solid #eee'}}>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th style={{textAlign: 'right'}}>Total Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {invoice?.products?.map((p, index) => (
                                    <tr key={index} style={{borderTop: '1px solid #eee'}}>
                                        <td>{index + 1}</td>
                                        <td>{p?.name}</td>
                                        <td>{p.quantity} {p.unit?.name}</td>
                                        <td>{p.price}</td>
                                        <td style={{textAlign: 'right'}}>{(p.quantity * p.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr style={{borderTop: '1px solid #eee'}}>
                                    <td colSpan={3}></td>
                                    <td style={{ fontWeight: "bold", paddingTop: 20}}>Sub Total</td>
                                    <td style={{ fontWeight: "bold", textAlign: "right", paddingTop: 20}}>{invoice?.total_amount}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold"}}>Total Vat</td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold", textAlign: "right"}}>{invoice?.total_vat}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold"}}>Discount</td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold", textAlign: "right"}}>- {invoice?.discount}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        {+settings?.show_previous_due === 1 && (
                                            <div style={{position: 'absolute', minWidth: 120}}>
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <p className="text-sm text-bold"
                                                    >Previous Due</p>
                                                    <p className="text-sm text-bold">{invoice?.history?.previous_due || 0}</p>
                                                </div>
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <p className="text-sm text-bold"
                                                    >Current Due</p>
                                                    <p className="text-sm text-bold">{invoice?.history?.current_due || 0}</p>
                                                </div>
                                                <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee',}}>
                                                    <p className="text-sm text-bold"
                                                    >Overall Due</p>
                                                    <p className="text-sm text-bold">{invoice?.history?.overal_due || 0}</p>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold"}}>Grand Total</td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold", textAlign: "right"}}>{invoice?.grand_total}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold"}}>Payment Method</td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold", textAlign: "right"}}>{invoice?.payment_method}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold"}}>Received Amount</td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold", textAlign: "right"}}>{invoice?.received}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold"}}>Paid Amount</td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold", textAlign: "right"}}>{invoice?.paid_amount}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold"}}>Change</td>
                                    <td style={{borderTop: '1px solid #eee', fontWeight: "bold", textAlign: "right"}}>{invoice?.change}</td>
                                </tr>
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <>
                            <hr/>
                            <div style={{marginBottom: 4}}></div>
                            {invoice?.products?.map((p, index) => (
                                <div key={index}>
                                    <p className="text-sm" style={{marginBottom: 2}}>{p?.name}</p>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <p className="text-sm"
                                           style={{marginBottom: 2}}>{p.quantity} {p.unit?.name} x {p?.price}</p>
                                        <p className="text-sm"
                                           style={{marginBottom: 2}}>{(p.quantity * p.price).toFixed(2)}</p>
                                    </div>
                                    <hr/>
                                </div>
                            ))}
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Sub Total</p>
                                <p className="text-sm text-bold">{invoice?.total_amount}</p>
                            </div>
                            <hr/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Total vat</p>
                                <p className="text-sm text-bold">{invoice?.total_vat}</p>
                            </div>
                            <hr/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Discount</p>
                                <p className="text-sm text-bold">- {invoice?.discount}</p>
                            </div>
                            <hr/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Grand Total</p>
                                <p className="text-sm text-bold">{invoice?.grand_total}</p>
                            </div>
                            <hr/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Payment Method</p>
                                <p className="text-sm text-bold">{invoice?.payment_method}</p>
                            </div>
                            <hr/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Received Amount</p>
                                <p className="text-sm text-bold">{invoice?.received}</p>
                            </div>
                            <hr/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Paid Amount</p>
                                <p className="text-sm text-bold">{invoice?.paid_amount}</p>
                            </div>
                            <hr/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm text-bold"
                                >Change Amount</p>
                                <p className="text-sm text-bold">{invoice?.change}</p>
                            </div>
                            <hr/>
                        </>
                    )}
                    <div style={{maxWidth: 500, margin: 'auto'}}>
                        <p className="text-xs text-center"
                           style={{marginTop: 12, marginBottom: 6}}>{settings?.return_policy}</p>
                        <p className="text-sm text-center mb-2 text-bold"
                           style={{backgroundColor: '#000', color: '#fff', padding: 2, borderRadius: 5}}
                        >{settings?.greetings_text}</p>
                        <p className="text-xs text-center">Software Solution By Coxsea Group</p>
                    </div>

                </div>
            </div>
            <iframe id="print-frame" className="hidden">
            </iframe>
        </>
    )
}

export const handleInvoicePrint = () => {
    let body = document.querySelector('#print-content').innerHTML;
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