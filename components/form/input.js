import React from "react"
import {DatePicker, Form, TimePicker} from "antd"

const FormInput = ({
                       name,
                       label,
                       className,
                       type = 'text',
                       required = false,
                       initialValue = '',
                       rules = [],
                       dependencies = [],
                       isEmail,
                       readOnly,
                       onChange,
                       placeholder,
                       textArea = false,
                       style,
                       disabledDate,
                       autoComplete
                   }) => {
    let initRules = [
        {required: required, message: `Please provide ${label?.toLowerCase() || 'a value'}`},
    ]
    if (isEmail === true) {
        initRules.push({type: 'email', message: 'Please enter a valid email address'})
    }
    return (
        <Form.Item
            name={name}
            className={className}
            label={label}
            dependencies={dependencies}
            initialValue={initialValue}
            rules={[...initRules, ...rules]}
        >
            {type === 'time' ? (
                <TimePicker format="hh:mm a" className="form-input"/>
            ) : type === 'date' ?
                (
                    <DatePicker className="form-input" disabledDate={disabledDate}/>
                ) : textArea ? (<textarea readOnly={readOnly} onChange={onChange} placeholder={placeholder}
                                          className="form-input"/>) : (
                    <input type={type} readOnly={readOnly} onChange={onChange} placeholder={placeholder} style={style}
                           autoComplete={autoComplete} className="form-input"/>
                )}

        </Form.Item>
    )
}
export default FormInput

export const HiddenFormItem = ({name, initialValue = ''}) => {
    return (
        <Form.Item name={name} initialValue={initialValue} hidden>
            <input/>
        </Form.Item>
    )
}