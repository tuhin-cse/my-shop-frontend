import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import {useFetch} from "../../../helpers/hooks";
import {fetchProductStock} from "../../../helpers/backend_helper";
import Table from "../../../components/common/table";

const Stock = () => {
    const [stock, getStocks] = useFetch(fetchProductStock)

    const columns = [
        {dataField: 'name', text: 'Name'},
        {dataField: 'unit', text: 'Unit'},
        {dataField: 'sale', text: 'Sale Qty'},
        {dataField: 'total', text: 'Total Qty'},
        {dataField: 'stock', text: 'Stock Qty'},
    ]

    return (
        <>
            <PageTitle title="Stock"/>
            <Table
                onReload={getStocks}
                columns={columns}
                data={stock}
                pagination
                noActions
                indexed
            />
        </>
    )
}
Stock.layout = UserLayout
export default Stock