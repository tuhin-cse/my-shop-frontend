import React from 'react'

const Card = ({title, rightAction, children, className, ...props}) => {

    return (
        <div className={"w-full bg-white shadow-lg rounded-sm mb-4 relative " + (className ? className : '')} {...props}>
            {title && (
                <header className="px-4 pt-3 pb-2 border-b border-gray-100 flex justify-between">
                    {typeof title === "string" ? <h2> {title} </h2> : title}
                    {rightAction}
                </header>
            )}
            <div className="p-3 h-full">
                {children}
            </div>
        </div>
    )
}
export default Card
