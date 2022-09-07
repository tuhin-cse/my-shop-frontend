import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useRouter} from "next/router";
import {useFetch} from "../../../helpers/hooks";
import {fetchInvoiceSettings, fetchSellInvoice} from "../../../helpers/backend_helper";
import {useEffect} from "react";
import Card from "../../../components/common/card";
import {handleInvoicePrint, InvoiceDetails} from "./index";
import moment from "moment";
import Button from "../../../components/common/button";

const SaleDetails = () => {
    const {query} = useRouter()
    const [invoice, getSale] = useFetch(fetchSellInvoice, {}, false)
    useEffect(() => {
        if(query?.id) {
            getSale(query)
        }
    }, [query?.id])

    const [settings] = useFetch(fetchInvoiceSettings)



    return (
        <>
            <PageTitle title="Sale Details" breadcrumbs={[{label: 'Dashboard', href: '/'}, {
                label: 'Sales',
                href: '/sales'
            }, {label: "Sale Details"}]}/>

            <Card>
                <Button className="absolute right-4" onClick={handleInvoicePrint}>Print</Button>
                <InvoiceDetails invoice={invoice} settings={settings}/>
                <div>
                    <div>
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
                        <>
                            <div style={{marginBottom: 8}}></div>
                            <table className="w-full">
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
                    </div>
                </div>
            </Card>
        </>
    )
}
SaleDetails.layout = UserLayout
export default SaleDetails