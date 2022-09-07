import {Form} from "antd";
import {useRouter} from "next/router";
import {useFetch} from "../../../helpers/hooks";
import {fetchSell} from "../../../helpers/backend_helper";
import {useEffect} from "react";
import moment from "moment/moment";
import PageTitle from "../../../components/common/page-title";
import UserLayout from "../../../layouts/user";
import {SaleForm} from "./edit/[id]";

const AddSale = () => {
    const [form] = Form.useForm()
    const {query} = useRouter()
    const [sell, getSale] = useFetch(fetchSell, {}, false)
    useEffect(() => {
        if (query?.id) {
            getSale(query)
        }
    }, [query?.id])

    useEffect(() => {
        if (sell) {
            form.setFieldsValue({
                ...sell,
                date: moment(sell?.date, 'YYYY-MM-DD'),
                customer_id: +sell.customer_id,
            })
        }
    }, [sell])


    return (
        <>
            <PageTitle title="Update Sale" breadcrumbs={[{label: 'Dashboard', href: '/'}, {
                label: 'Sales',
                href: '/sales'
            }, {label: "Update Sale"}]}/>
            <SaleForm form={form} sell={sell}/>
        </>
    )
}
AddSale.layout = UserLayout
export default AddSale