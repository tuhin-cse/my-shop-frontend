import UserLayout from "../../../layouts/user";
import PageTitle from "../../../components/common/page-title";
import Card from "../../../components/common/card";
import {Col, Row} from "react-bootstrap";
import {Checkbox, Form} from "antd";
import FormSelect from "../../../components/form/select";
import {useFetch} from "../../../helpers/hooks";
import {
    fetchBarcodeProducts,
    fetchLabelElements,
    fetchLabelProducts,
    fetchProducts
} from "../../../helpers/backend_helper";
import Barcode from 'react-barcode'
import FormInput from "../../../components/form/input";
import Button from "../../../components/common/button";
import {useEffect, useState} from "react";
import {useUserContext} from "../../../contexts/user";
import {useI18n} from "../../../contexts/i18n";

const BarcodePage = () => {
    const i18n = useI18n()
    const [form] = Form.useForm()
    const [products, getProducts] = useFetch(fetchBarcodeProducts)
    const [barcode, setBarcode] = useState()

    const {currentBusiness} = useUserContext()

    let sizes = {
        '17': {width: '1.799in', height: '1.003in'},
        '26': {width: '2.624in', height: '1in'},
        '24': {width: '2.48in', height: '1.334in'},
        '41': {width: '4in', height: '1in'},
        '22': {width: '2.5in', height: '1.835in'},
        '413': {width: '4in', height: '1.33in'},
        '228': {width: '2.5in', height: '2.834in'},
        '42': {width: '4in', height: '2in'},
    }

    const pageWidth = +sizes[barcode?.size || '17']?.width.replace('in', '')

    const product = products?.docs?.find(p => p.label === barcode?.product)

    useEffect(() => {
        if (!!localStorage.getItem('barcode')) {
            try {
                let barcode = JSON.parse(localStorage.getItem('barcode'))
                getProducts({stock_id: barcode.stock})
                form.setFieldsValue(barcode)
            } catch (e) {

            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('barcode', JSON.stringify(barcode))
    }, [barcode])


    return (
        <>
            <PageTitle
                title="Barcode"
                breadcrumbs={[
                    {label: 'Dashboard', href: '/'},
                    {label: 'Products', href: '/products'},
                    {label: 'Barcode'}]}/>
            <Card>
                <Form layout="vertical" form={form} onFinish={setBarcode}>
                    <Row>
                        <Col md={4}>
                            <FormSelect label="Product" name="product" options={products?.map(d => ({
                                _id: d?.code,
                                name: `${d?.name} ${d?.variant ? ` (${d?.variant})` : ''}`
                            }))} required/>
                            <FormSelect label="Label Size" name="size" options={[
                                {name: '1.799" x 1.003"', _id: '17'},
                                {name: '2.624" x 1"', _id: '26'},
                                {name: '2.48" x 1.334"', _id: '24'},
                                {name: '4" x 1"', _id: '41'},
                                {name: '2.5" x 1.835"', _id: '22'},
                                {name: '4" x 1.33"', _id: '413'},
                                {name: '2.5" x 2.834"', _id: '228'},
                                {name: '4" x 2"', _id: '42'},
                            ]} required/>
                            <FormSelect label="Per Row" name="row" options={[
                                {name: '1', _id: 1},
                                {name: '2', _id: 2},
                                {name: '3', _id: 3},
                                {name: '4', _id: 4},
                                {name: '5', _id: 5},
                                {name: '6', _id: 6},
                            ]} required/>
                            <FormInput name="quantity" label="Quantity" initialValue={1} required/>
                            <Button>Generate</Button>
                        </Col>
                        <Col md={8}>
                            <div className="overflow-auto h-96" id="print-content">
                                <div className="flex flex-wrap barcode-wrapper"
                                     style={{minWidth: `${(pageWidth * barcode?.row) || 0}in`}}>
                                    {Array.apply(null, Array(+barcode?.quantity || 0)).map((_, index) => (
                                        <div
                                            className={`w-${barcode?.row < 2 ? 'full' : `1/${barcode?.row}`} pw-${barcode.row}`}
                                            key={index}>
                                            <div style={{
                                                padding: 10, ...sizes[barcode?.size],
                                                overflow: 'hidden',
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: 'center',
                                                flexDirection: "column"
                                            }} className="border">
                                                <span style={{
                                                    fontSize: 9,
                                                    marginBottom: 0,
                                                    fontWeight: "bold"
                                                }}>{currentBusiness?.name}</span>
                                                <span style={{fontSize: 9, marginBottom: 0,}}>{product?.name}</span>
                                                <Barcode value={barcode?.product} width={1} height={25}
                                                         fontSize={10} margin={2} style={{maxWidth: '100%'}}/>
                                                {barcode?.price && (
                                                    <span style={{
                                                        fontSize: 9,
                                                        marginBottom: 0,
                                                    }}> {currentBusiness?.currency} {product?.price}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 text-right">
                                <Button onClick={handleBarcodePrint}>Print</Button>
                            </div>
                        </Col>
                        <div className="hidden w-1/2 w-1/3 w-1/4 w-1/5 w-1/6"/>
                    </Row>
                </Form>
            </Card>
            <iframe id="print-frame" className="hidden">
            </iframe>
        </>
    )
}
BarcodePage.layout = UserLayout
export default BarcodePage

export const handleBarcodePrint = () => {
    let body = document.querySelector('#print-content').innerHTML;
    let frame = window.frames['print-frame'].contentWindow
    frame.document.head.innerHTML = `
        <style>    
        .barcode-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        .pw-1 {
            width: 100%!important;
        }
        .pw-2 {
            width: 50%!important;
        }
        .pw-3 {
            width: 33.3333%!important;
        }
         .pw-4 {
            width: 25%!important;
        }
        .pw-5 {
            width: 20%!important;
        }
        .pw-6 {
            width: 16.6666%!important;
        }
        
        @media print {
            @page { margin: 0}
            body { margin: 15px }
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