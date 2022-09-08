import UserLayout from "../../../layouts/user";
import {Col, Row} from "react-bootstrap";
import Card from "../../../components/common/card";
import {Form, Modal} from "antd";
import {FiTrash} from "react-icons/fi";
import {useEffect, useState} from "react";
import {useAction, useFetch} from "../../../helpers/hooks";
import {fetchPosElements, fetchPosProducts, postPosOrder} from "../../../helpers/backend_helper";
import swalAlert, {antdAlert} from "../../../components/common/alert";
import Head from "next/head";
import {handleInvoicePrint, InvoiceDetails} from "../transactions";
import FormInput from "../../../components/form/input";
import Button from "../../../components/common/button";
import {RiArrowUpDownFill} from "react-icons/ri";
import {useSite} from "../../../contexts/site";

const Pos = () => {
    const site = useSite()
    const [passForm] = Form.useForm()
    const [paymentForm] = Form.useForm()
    const [visiblePayment, setVisiblePayment] = useState(false)
    const [visibleSelector, setVisibleSelector] = useState(false)
    const [visibleQr, setVisibleQr] = useState(false)
    const [visiblePass, setVisiblePass] = useState(false)
    const [card, setCard] = useState('')
    const [details, setDetails] = useState()
    const [project, setProject] = useState()
    const handleCardChange = value => {
        let card = value.replaceAll(/\D/g, '')
        setCard(card?.split('').map((d, index) => `${index && index % 4 === 0 ? '-' : ''}${d}`).join('').substring(0, 19))
    }

    useEffect(() => {
        if (card?.length === 19 && card?.replaceAll('-', '').length === 16 && card.substring(0, 4) === '7489') {
            if (true) {
                passForm.resetFields()
                passForm.setFieldsValue({card: card?.replaceAll('-', '')})
                setVisiblePass(true)
            }

        }
    }, [card])

    useEffect(() => {
        if (details) {
            if (!project) {
                setProject(details?.balances[0]?.project?._id)
            }
        }
    }, [details])


    const [currentShop, setCurrentShop] = useState()
    const [elements] = useFetch(fetchPosElements)

    useEffect(() => {
        if (elements) {
            if (elements?.shops?.length > 1) {
                const selected = localStorage.getItem('currentShop')
                if (!!selected) {
                    let shop = elements?.shops?.find(shop => shop._id === selected)
                    if (shop) {
                        setCurrentShop(shop)
                    } else {
                        setVisibleSelector(true)
                    }
                } else {
                    if (!currentShop) {
                        setVisibleSelector(true)
                    }
                }
            } else {
                setCurrentShop(elements?.shops[0])
            }
        }
    }, [elements])

    const [products, getProducts] = useFetch(fetchPosProducts, {}, false)
    useEffect(() => {
        if (currentShop) {
            getProducts({shop: currentShop._id})
        }
    }, [currentShop])

    const filter = data => {
        if (barcode) {
            if (!data?.product?.code?.includes(barcode)) {
                return false
            }
        }
        if (!!project) {
            return !!details?.products?.find(d => {
                return d.project === project && d.product === data?.product._id
            })
        }
        return true
    }


    useEffect(() => {
        if (window.innerWidth > 1024) {
            document.querySelector('.dashboard')?.classList.add('mini')
        }
        return () => {
            document.querySelector('.dashboard')?.classList.remove('mini')
        }
    })

    const [update, setUpdate] = useState(false)
    const reload = () => setUpdate(!update)

    const [cart, setCart] = useState([])
    let balance = details?.balances?.find(d => d.project._id === project)?.balance || 0
    const total = cart?.reduce((acc, d) => acc + ((d?.quantity * d.price) || 0), 0) || 0
    const addProduct = product => {
        if (details) {
            let projectProduct = details?.products?.find(p => p.product === product.product._id && p.project === project)
            let fee = 0
            if (projectProduct.accounting_type === 'Agent - IDEA - Shop') {
                fee = details?.fees?.fees?.find(d => d.sub_category === projectProduct.sub_category)?.fee || 0
            }
            if (!!projectProduct) {
                if (total + projectProduct.price <= balance) {
                    let find = cart?.find(d => d._id === projectProduct._id)
                    if (find) {
                        find.quantity++
                    } else {
                        cart.push({
                            ...product.product,
                            _id: projectProduct._id,
                            price: projectProduct.price,
                            fee_rate: fee,
                            fee: (projectProduct.price * fee) / 100,
                            quantity: 1
                        })
                    }
                    reload()
                } else {
                    return antdAlert.warning('Insufficient balance', '')
                }
            } else {
                return antdAlert.warning('Unexpected Error', 'Verify card again')
            }
        } else {
            return antdAlert.warning('No Card Selected', 'Please select a card')
        }
    }

    const [barcode, setBarcode] = useState('')

    const handleCancel = async () => {
        let {isConfirmed} = await swalAlert.confirm('Are you sure want to clear the cart?', 'Yes, Clear')
        if (isConfirmed) {
            setCart([])
            setCard('')
            setDetails(undefined)
            setProject(undefined)
        }
    }

    const handlePaymentSubmit = (values) => {
        return useAction(
            postPosOrder,
            {
                ...values,
                items: cart,
                beneficiary: details?._id,
                shop: currentShop?._id,
                project,
                round: details?.balances?.find(d => d.project._id === project)?.round,
                project_card: details?.balances?.find(d => d.project._id === project)?._id,
                card: details?.balances?.find(d => d.project._id === project)?.card,
                password: encryptPassword(values.password)
            },
            async (data) => {
                await swalAlert.success("Successfully placed order")
                setInvoice(data)
                window.setTimeout(() => {
                    handleInvoicePrint()
                }, 500)
                setVisiblePayment(false)
                setCart([])
                setCard('')
                setDetails(undefined)
                setProject(undefined)
            }, false)
    }

    const [invoice, setInvoice] = useState()

    const ShopProducts = () => {
        return (
            <>
                <div className="flex justify-between flex-wrap">
                    <div className="flex items-center mb-2 w-full sm:w-auto">
                        <RiArrowUpDownFill
                            className="mx-2"
                            role="button"
                            onClick={() => setVisibleSelector(true)}/>
                    </div>
                    <div className="w-full md:w-72">
                        <input className="form-input mb-2" placeholder={'Barcode'} value={barcode}
                               onChange={e => setBarcode(e.target.value)}/>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-2 my-2">
                    {products?.filter(filter).map((product, index) => (
                        <div className="border rounded m-2 p-2 w-36 relative" role="button"
                             onClick={() => addProduct(product)} key={index}>
                            <img className="h-28 mx-auto" src={product?.image || '/img/product.png'}
                                 alt=""/>
                            <p className="text-xs mb-0.5 font-semibold"> {product?.product?.name}</p>
                        </div>
                    ))}
                </div>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>POS | {site?.site_name}</title>
            </Head>
            <Row>
                <Col md={7} className="hidden md:block">
                    <Card style={{minHeight: 'calc(100vh - 120px)'}}>
                        <ShopProducts/>
                    </Card>
                </Col>
                <Col md={5} className="pr-0 sm:pr-2">
                    <Card style={{minHeight: 'max(500px, calc(100vh - 120px))'}}>
                        <div>
                            <div className="relative">
                                <div className="md:hidden mt-4">
                                    <ShopProducts/>
                                </div>
                                <div className="overflow-auto mt-3 slim-scroll"
                                     style={{height: 'max(calc(100vh - 500px), 300px)'}}>
                                    <table className="table-auto w-full">
                                        <thead
                                            className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">#</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-left">{'Product'} </div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap w-24">
                                                <div className="font-semibold text-center">{'Price'} </div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap w-24">
                                                <div className="font-semibold text-center">{'Quantity'} </div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap w-24">
                                                <div className="font-semibold text-end">{'Subtotal'} </div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap text-end" style={{width: 80}}/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cart?.map((product, index) => (
                                            <tr key={index}>
                                                <td className="p-2 h-8 whitespace-nowrap text-gray-500">{index + 1} </td>
                                                <td className="p-2 whitespace-nowrap text-gray-500 ">{product?.name}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-500 ">{product?.price}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-500 w-24">
                                                    <input
                                                        type="number"
                                                        className="w-full focus:outline-none text-center"
                                                        value={product?.quantity}
                                                        autoComplete="off"
                                                        step={0.5}
                                                        onChange={e => {
                                                            let previous = product.quantity
                                                            product.quantity = !!e.target.value ? Math.abs(+e.target.value) : ''
                                                            let total = cart?.reduce((acc, d) => acc + ((d?.quantity * d.price) || 0), 0) || 0
                                                            if (total > balance) {
                                                                product.quantity = previous
                                                                antdAlert.warning('Insufficient balance', '')
                                                            }
                                                            reload()
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-gray-500 text-end">{((product?.price || 0) * (product?.quantity || 0)).toFixed(2)}</td>
                                                <td className="text-right px-2">
                                                    <FiTrash
                                                        className="inline-block text-danger inline-block"
                                                        role="button"
                                                        onClick={() => {
                                                            setCart(cart?.filter(d => d._id !== product._id))
                                                        }}
                                                        size={18}/>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <table className="w-full mt-3.5">
                                        <tbody>
                                        <tr className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
                                            <td className="border-none p-2 text-gray-500">Total Items</td>
                                            <td className="border-none p-2 text-gray-500 text-right">{cart?.length}</td>
                                            <td className="border-none p-2 text-gray-500">Total</td>
                                            <td className="border-none p-2 text-gray-500 text-end">{total.toFixed(2)}</td>
                                        </tr>
                                        <tr className="text-xs font-semibold uppercase text-gray-500 bg-blue-400">
                                            <td className="border-none p-2 text-white"
                                                colSpan={2}>Total Payable
                                            </td>
                                            <td className="border-none p-2 text-white text-right"
                                                colSpan={2}>{total.toFixed(2)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <Modal
                                    visible={visiblePayment}
                                    width={800}
                                    onCancel={() => setVisiblePayment(false)}
                                    footer={null} title={'Payment'}>
                                    <table className="w-full table-bordered mb-4">
                                        <tbody>
                                        <tr>
                                            <td className="p-3">Total Items {cart?.length}</td>
                                            <td className="p-3">Total Payable ${total.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3">Card Balance ${balance.toFixed(2)}</td>
                                            <td className="p-3">Total paying $0.00</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <Form layout="vertical" form={paymentForm} onFinish={handlePaymentSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <FormInput name="credit" label="Credit Amount" type="number" readOnly/>
                                            </Col>
                                            <Col md={6}>
                                                <FormInput name="password" label="Card Password"
                                                           style={{webkitTextSecurity: 'disc',}} autoComplete="off"
                                                           required/>
                                            </Col>
                                        </Row>
                                        <FormInput name="note" label="Note" textArea/>
                                        <Button>Submit</Button>
                                    </Form>
                                </Modal>
                            </div>
                            <div className="flex mt-4 rounded overflow-hidden">
                                <button
                                    onClick={handleCancel}
                                    className="w-1/2 btn-danger h-10">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (total <= balance) {
                                            paymentForm.resetFields()
                                            paymentForm.setFieldsValue({credit: total})
                                            setVisiblePayment(true)
                                        } else {
                                            antdAlert.warning('Insufficient balance', '')
                                        }

                                    }}
                                    className="w-1/2 bg-main hover:bg-main2 text-white h-10">
                                    Payment
                                </button>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
            <InvoiceDetails invoice={invoice}/>
        </>
    )
}
Pos.layout = UserLayout
export default Pos


export const encryptPassword = password => {
    let publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAykVqKNlCXkPhrbpJwJ33
3+2oEHAGZ+DhbuKjEoutgLpwlUzoj+RYNPQ8jH5pQFmJpJcylXwOmoDj6oNsJuT8
w4qaXqa5DVI2E8MiQZWIRT9qGSneZuOcJmQHZ36UhQMm6jexV74vsFXRLJHXyKYO
C6s2pru4D8DGY1FUT8DLW1CjObfxWh57hdyZTL1/kSLy9AnOWIr7MpEI4NtTJonl
2rghjPlxiu3+N/X+iQv5qbbXUKnCkDUkYPgyD8bbKrQ6jXIxwvVTsdLOs/Tk69vg
TWveiqmr+ZkCL0hC/MlFX6vCQrUVMLOKKchTG2EKhNt5E5/XfkjbSLCEPTibfODq
gwIDAQAB
-----END PUBLIC KEY-----`
    const JSEncrypt = require('jsencrypt/bin/jsencrypt.min')
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(publicKey);
    return jsEncrypt.encrypt(password);
}