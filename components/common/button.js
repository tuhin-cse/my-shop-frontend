const Button = ({children, className, ...props}) => {

    return (
        <button {...props}
                className={`bg-main px-4 py-2.5 text-sm text-white rounded font-medium text-wra hover:bg-main2 ${className}`}
                style={{whiteSpace: 'nowrap'}}>{children}</button>
    )
}
export default Button