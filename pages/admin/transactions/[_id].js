import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import Card from "../../../components/common/card";
import {useFetch} from "../../../helpers/hooks";
import {fetchPosTransaction} from "../../../helpers/backend_helper";
import {handleInvoicePrint, InvoiceDetails} from "./index";
import {useRouter} from "next/router";
import moment from "moment";
import {FaPrint} from "react-icons/fa";
import Table from "../../../components/common/table";
import {useI18n} from "../../../contexts/i18n";

const Transaction = () => {
    const i18n = useI18n()
    let {query} = useRouter()
    const [transaction] = useFetch(fetchPosTransaction, query)

    const columns = [
        {dataField: 'name', text: 'Name'},
        {dataField: 'price', text: 'Price', formatter: d => d?.toFixed(2)},
        {dataField: 'quantity', text: 'Quantity'},
        {dataField: 'subtotal', text: 'Sub Total', className: "text-right", formatter: d => d?.toFixed(2)}
    ]

    return (
        <>
            <PageTitle title="Transaction Details"/>
            <Card>
                <div className="relative">
                    <button className={"absolute btn btn-success " + (i18n.direction === 'rtl' ? 'left-0' : 'right-0')}
                            onClick={handleInvoicePrint}><FaPrint
                        className="inline-block me-2"/>{i18n.t("Print")}
                    </button>
                    <div className="flex flex-wrap">
                        <img src={transaction?.shop?.image} style={{height: 180}} className="p-4" alt=""/>
                        <div className="flex flex-grow justify-between px-4 pt-12">
                            <div>
                                <p className="text-gray-500">{i18n.t("Shop Name")}: {transaction?.shop?.name}</p>
                                {/*<p>Phone : {transaction?.shop?.phone}</p>*/}
                                <p className="text-gray-500">{i18n.t("Company")}/{i18n.t('Organization')} : {transaction?.project?.company?.name}</p>
                                <p className="text-gray-500">{i18n.t("Project name")}: {transaction?.project?.name}</p>
                                <p className="text-gray-500"> {i18n.t("Round Name")}: {transaction?.round?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">{i18n.t("Sale No")}:
                                    #{transaction?.ref?.toString().padStart(4, '0')}</p>
                                <p className="text-gray-500">{i18n.t("Date")}: {moment(transaction?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                                <p className="text-gray-500">{i18n.t("Card")}: {transaction?.card?.card?.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="-mx-4">
                        <Table
                            indexed
                            noHeader
                            noActions
                            shadow={false}
                            columns={columns}
                            data={transaction?.items}
                        />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 ml-auto">
                        <table className="w-full">
                            <tbody>
                            <tr>
                                <td className="border-none p-2 text-gray-500">{i18n.t("Total")}</td>
                                <td className="border-none p-2 text-gray-500 text-right">{transaction?.total?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="border-none p-2 text-gray-500">{i18n.t("Credit")}</td>
                                <td className="border-none p-2 text-gray-500 text-right">{transaction?.total?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="border-none p-2 text-gray-500">{i18n.t("Paid")}</td>
                                <td className="border-none p-2 text-gray-500 text-right">{transaction?.total?.toFixed(2)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                <InvoiceDetails invoice={transaction}/>
            </Card>
        </>
    )
}
Transaction.layout = UserLayout
export default Transaction