import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useFetch} from "../../../helpers/hooks";
import {fetchPosTransactions, fetchTransactionElements, fetchTransactionRounds} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";
import moment from "moment";
import {useState} from "react";
import {FaPrint} from "react-icons/fa";
import {useRouter} from "next/router";
import {Select} from "antd";
import {useSite} from "../../../contexts/site";

const Transactions = () => {
    const router = useRouter()
    const [card, setCard] = useState()
    const [elements] = useFetch(fetchTransactionElements)
    const [rounds, getRound] = useFetch(fetchTransactionRounds, {}, false)

    const [transactions, getTransactions] = useFetch(fetchPosTransactions)

    const columns = [
        {dataField: 'ref', text: 'Sale No'},
        {dataField: 'shop', text: 'Shop', formatter: d => d?.name},
        {
            dataField: 'card',
            text: 'Card',
            formatter: d => d?.card.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`)
        },
        {
            dataField: 'sale',
            text: 'AA',
            formatter: (_, d) => `${d?.project?.name} / ${d?.round?.name}`
        },
        {dataField: 'createdAt', text: 'Date', formatter: d => moment(d).format('Do MMM, YYYY')},
        {dataField: 'total', text: 'Subtotal'},
        {dataField: 'total', text: 'paid'},
    ]

    if (elements?.shops?.length > 0) {
        columns.push({dataField: 'fee', text: 'fee', formatter: d => d?.toFixed(2)})
    }

    const [invoice, setInvoice] = useState()

    return (
        <>
            <PageTitle title="Card Transactions"/>
            <InvoiceDetails invoice={invoice}/>
            <Table
                onReload={getTransactions}
                columns={columns}
                data={transactions}
                title={(
                    <div className="flex flex-wrap">
                        {elements?.shops?.length > 0 && (
                            <Select
                                className="w-44 select-38 me-3"
                                placeholder={i18n.t('Shop')}
                                onClear={() => {
                                    getTransactions({shop: undefined})
                                }}
                                onSelect={value => {
                                    getTransactions({shop: value})
                                }}
                                options={elements?.shops?.map(d => ({label: d?.name, value: d._id}))} allowClear/>
                        )}
                        {elements?.projects?.length > 0 && (
                            <>
                                <Select
                                    className="w-44 select-38 me-3"
                                    placeholder={'Project'}
                                    onClear={() => {
                                        getTransactions({project: undefined})
                                    }}
                                    onSelect={value => {
                                        getRound({project: value})
                                        getTransactions({project: value})
                                    }}
                                    options={elements?.projects?.map(d => ({label: d?.name, value: d._id}))}
                                    allowClear/>
                                <Select
                                    className="w-44 select-38 me-3"
                                    placeholder={'Round'}
                                    onClear={() => {
                                        getTransactions({round: undefined})
                                    }}
                                    onSelect={value => {
                                        getTransactions({round: value})
                                    }}
                                    options={rounds?.map(d => ({label: d?.name, value: d._id}))} allowClear/>
                            </>
                        )}
                        <div className="w-44">
                            <input value={card} className="form-input" placeholder="Card" onChange={e => {
                                let card = e?.target?.value?.replaceAll(/\D/g, '')
                                setCard(card?.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`).join('').substring(0, 19))
                                getTransactions({card: card || undefined})
                            }}/>
                        </div>
                    </div>
                )}
                pagination
                actions={data => (
                    <>
                        <button className="btn btn-outline-primary btn-sm focus:shadow-none me-2"
                                title="Print" onClick={() => {
                            setInvoice(data)
                            window.setTimeout(() => {
                                handleInvoicePrint()
                            }, 300)

                        }}>
                            <FaPrint/>
                        </button>
                    </>
                )}
                onView={({_id}) => router.push('/admin/transactions/' + _id)}
                indexed
            />
        </>
    )
}
Transactions.layout = UserLayout
export default Transactions


export const InvoiceDetails = ({invoice}) => {
    const site = useSite()
    console.log(site)
    return (
        <>
            <div id="print-content" className="hidden">
                <div style={{maxWidth: 300, overflow: "hidden"}}>
                    <div>
                        <div className="text-center">
                            <img src={site?.logo}
                                 style={{height: 40, display: 'inline-block', marginBottom: 4}} alt=""/>
                        </div>
                        <h4 style={{fontSize: 16, textAlign: 'center', margin: 2}}>{site?.site_name}</h4>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <div className="text-center">
                                <img src={invoice?.shop?.image || '/img/shops.png'}
                                     style={{height: 40, display: 'inline-block', marginBottom: 4}} alt=""/>
                            </div>
                            <h4 style={{fontSize: 14, textAlign: 'center', margin: 2}}>{invoice?.shop?.name}</h4>
                        </div>
                        <div>
                            <div className="text-center">
                                <img src={invoice?.project?.company?.logo || '/img/shops.png'}
                                     style={{height: 40, display: 'inline-block', marginBottom: 4}} alt=""/>
                            </div>
                            <h4 style={{fontSize: 14, textAlign: 'center', margin: 2}}>{invoice?.project?.company?.name}</h4>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8}}>
                        <div>
                            <p className="text-sm">Project name: {invoice?.project?.name}</p>
                            <p className="text-sm">Round Name : {invoice?.round?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm">Sale No:
                                #{invoice?.ref?.toString().padStart(4, '0')}</p>
                            <p className="text-sm">Date: {moment(invoice?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                        </div>
                    </div>
                    <p className="text-sm mb-2">Card: {invoice?.card?.card?.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`)}</p>
                    <hr/>
                    <div style={{marginBottom: 4}}></div>
                    {invoice?.items?.map((p, index) => (
                        <div key={index}>
                            <p className="text-sm" style={{marginBottom: 2}}>{p?.name}</p>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p className="text-sm"
                                   style={{marginBottom: 2}}>{p.quantity} x {p?.price}</p>
                                <p className="text-sm"
                                   style={{marginBottom: 2}}>{(p.quantity * p.price).toFixed(2)}</p>
                            </div>
                            <hr/>
                        </div>
                    ))}
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-sm text-bold"
                        >Total</p>
                        <p className="text-sm text-bold">$ {invoice?.total}</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p className="text-sm text-bold"
                        >"Paid</p>
                        <p className="text-sm text-bold">$ {invoice?.total}</p>
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