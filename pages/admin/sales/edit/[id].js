import {Form} from "antd";
import PageTitle from "../../../../components/common/page-title";
import UserLayout from "../../../../layouts/user";
import {useAction, useFetch} from "../../../../helpers/hooks";
import {fetchSell, fetchSellElements, fetchSellStock, postSell} from "../../../../helpers/backend_helper";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import moment from "moment";
import Card from "../../../../components/common/card";
import FormInput, {HiddenFormItem} from "../../../../components/form/input";
import {Col, Row} from "react-bootstrap";
import FormSelect from "../../../../components/form/select";
import Button from "../../../../components/common/button";
import {FaTrash} from "react-icons/fa";

const UpdateSale = () => {
    const [form] = Form.useForm()
    const {query} = useRouter()
    const [sell, getSale] = useFetch(fetchSell, {}, false)
    useEffect(() => {
        if(query?.id) {
            getSale(query)
        }
    }, [query?.id])

    useEffect(() => {
        if(sell) {
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
UpdateSale.layout = UserLayout
export default UpdateSale



export const SaleForm = ({form, sell}) => {
    const router = useRouter()
    const [update, setUpdate] = useState(false)
    const [elements] = useFetch(fetchSellElements)
    const [products, setProducts] = useState([])
    const [stock, setStock] = useState()
    const [vat, setVat] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [paid, setPaid] = useState(0)
    let total = products?.reduce((acc, d) => acc + ((d?.quantity * d.price) || 0) , 0) || 0
    const totalVat = (total / 100) * vat

    useEffect(() => {
        if(!!elements) {
            let find = elements?.accounts?.find(a => +a.default === 1)
            if(find) {
                form.setFieldsValue({account_id: find.id})
            }
        }
    }, [elements])

    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        if(!loaded && sell) {
            total = +sell.total_amount
            setProducts(sell?.products)
            setDiscount(+sell?.discount)
            setVat(+sell?.vat)
            setPaid(+sell?.paid_amount)
            setStock(+sell?.stock_id)
            //  setLoaded(true)
        }
    }, [loaded, sell])

    const suppliers = sell?.customer ? [{name: sell?.customer?.name, id:  sell?.customer?.id}] : [{name: 'No Customer', id: 0}]

    return (
        <Form layout="vertical" form={form} onFinish={(values) => {
            values.date = moment(values.date).format('YYYY-MM-DD')
            values.products = JSON.stringify(products?.map(product => ({...product, unit: undefined})))
            values.total_vat = totalVat || 0
            values.paid_amount = paid || 0
            values.total_amount = total || 0
            values.discount = discount || 0
            return useAction(postSell, values, () => router.push('/sales')
            )
        }}>
            <Card>
                {sell && <HiddenFormItem name="id" initialValue={sell?.id}/>}
                <Row>
                    <Col md={4}>
                        <FormInput name="date" label="Date" initialValue={moment()} type="date" required/>
                    </Col>
                    <Col md={4}>
                        <FormSelect
                            disabled={true}
                            name="customer_id"
                            label="Customer"
                            options={suppliers} required/>
                    </Col>
                    <Col md={4}>
                        <FormSelect
                            name="stock_id"
                            label="Stock"
                            onSelect={setStock}
                            options={elements?.stock}/>
                    </Col>
                </Row>
                <ProductSearch
                    products={products}
                    setProducts={setProducts}
                    stock={stock}
                    update={update}
                    setUpdate={setUpdate}
                />
                <Row className="mt-4">
                    <Col md={8}>
                        <Row>
                            <Col md={6}>
                                <FormInput name="vat" label="Vat (%)" type="number" initialValue={0} onChange={e => setVat(+e.target.value || 0)} required/>
                                <FormSelect
                                    disabled={!!sell}
                                    name="account_id"
                                    label="Account"
                                    options={elements?.accounts} required/>
                                <Form.Item name="notes" label="Notes" initialValue="">
                                    <textarea className="form-input" rows={3}/>
                                </Form.Item>
                            </Col>
                            <Col md={6}>
                                <FormInput name="discount" label="Discount" type="number" onChange={e => setDiscount(+e.target.value || 0)} initialValue={0} required/>
                                <FormInput name="paid_amount" label="Paid Amount" type="number" onChange={e => setPaid(+e.target.value || 0)} initialValue={0} required/>
                                <FormSelect
                                    name="payment_method"
                                    label="Payment Method"
                                    initialValue="Cash"
                                    options={[{id: 'Cash', name: "Cash"}, {id: 'Bank Transfer', name: "Bank Transfer"}]}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <table className="w-full mt-6">
                            <tbody className="">
                            <tr className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
                                <td className="p-2">Subtotal</td>
                                <td className="p-2 text-right">{total.toFixed(2)}</td>
                            </tr>
                            <tr className="text-xs font-semibold uppercase text-gray-500">
                                <td className="p-2">Discount</td>
                                <td className="p-2 text-right">{discount.toFixed(2)}</td>
                            </tr>
                            <tr className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
                                <td className="p-2 border-b">Total Vat</td>
                                <td className="p-2 border-b text-right">{totalVat.toFixed(2)}</td>
                            </tr>
                            <tr className="text-xs font-semibold uppercase text-gray-500">
                                <td className="p-2">Total</td>
                                <td className="p-2 text-right">{(total + totalVat - discount).toFixed(2)}</td>
                            </tr>
                            <tr className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
                                <td className="p-2 border-b">Paid</td>
                                <td className="p-2 border-b text-right">{paid.toFixed(2)}</td>
                            </tr>
                            <tr className="text-xs font-semibold uppercase text-gray-500">
                                <td className="p-2">Due</td>
                                <td className="p-2 text-right">{(total + totalVat - discount - paid).toFixed(2)}</td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="text-right mt-4">
                            <Button>Submit</Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Form>
    )
}

const ProductSearch = ({products, setProducts, stock, update, setUpdate}) => {
    const [value, setValue] = useState()
    const [show, setShow] = useState(false)
    const addProduct = data => {
        let find = products?.find(d => d.id === data.id)
        if (!find) {
            products.push({
                ...data,
                quantity: 1,
                unit_id: data?.unit.id
            })
            setUpdate(!update)
        }
        setShow(false)
    }
    const handleRemove = id => {
        setProducts(products?.filter(d => d.id !== id))
    }

    const filter = d => {
        if (value) {
            return !!(d.code?.toLowerCase()?.includes(value?.toLowerCase())
                || d.name?.toLowerCase()?.includes(value?.toLowerCase())
                || d.variant?.toLowerCase()?.includes(value?.toLowerCase()));
        }
        return true
    }

    const ref = useRef()
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShow(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    const [options, setOptions] = useState([])


    useEffect(() => {
        if (stock) {
            fetchSellStock({
                business_id: localStorage.getItem('currentBusiness'),
                stock_id: stock,
            }).then(({success, data}) => {
                if (success === true) {
                    setOptions(data)
                }
            })
        }
    }, [stock])


    return (
        <>
            <div className="relative" ref={ref}>
                <div className="ant-form-item-label">
                    <label>Product</label>
                </div>
                <input
                    className='form-input'
                    value={value}
                    onClick={() => setShow(true)}
                    onChange={e => setValue(e.target.value)}/>
                <div className="absolute bg-white shadow-2xl w-full z-30" style={{display: show ? 'block' : 'none'}}>
                    {!stock &&
                        <div className="py-4 px-3 border-b border-b-gray-100 text-danger">Please select stock</div>}
                    {options?.filter(filter).map((d, index) => (
                        <div
                            onClick={() => addProduct(d)}
                            role="button"
                            className="py-1.5 px-3 border-b border-b-gray-100"
                            key={index}>{d?.code} - {d?.name} {!!d?.variant && <>({d?.variant})</>}
                        </div>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto mt-3">
                <table className="table-auto w-full">
                    <thead className="text-xs font-semibold uppercase text-white bg-main2 bg-opacity-80">
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">#</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Name</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Unit</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Quantity</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Price</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Total</div>
                    </th>
                    <th className="p-2 whitespace-nowrap w-32">
                        <div className="font-semibold text-left">Action</div>
                    </th>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                    {products?.map((product, index) => (
                        <tr key={index}>
                            <td className="p-2 whitespace-nowrap text-gray-500">{index + 1}</td>
                            <td className="p-2 whitespace-nowrap text-gray-500">{product?.name} {product?.variant && `(${product?.variant})`}</td>

                            <td className="p-2 whitespace-nowrap text-gray-500">{product?.unit?.name}</td>
                            <td className="p-2 whitespace-nowrap text-gray-500" style={{maxWidth: 60}}>
                                <input
                                    value={product?.quantity}
                                    onChange={e => {
                                        product.quantity = e.target.value
                                        setUpdate(!update)
                                    }}
                                    className="w-full focus:outline-none"
                                    type="number"/>
                            </td>
                            <td className="p-2 whitespace-nowrap text-gray-500" style={{maxWidth: 80}}>
                                <input
                                    value={product?.price}
                                    onChange={e => {
                                        product.price = e.target.value
                                        setUpdate(!update)
                                    }}
                                    className="w-full focus:outline-none"
                                    type="number"/>
                            </td>
                            <td className="p-2 whitespace-nowrap text-gray-500">{product?.price * product?.quantity}</td>
                            <td className="p-2">
                                <FaTrash role="button" className="text-danger"
                                         onClick={() => handleRemove(product.id)}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )

}
