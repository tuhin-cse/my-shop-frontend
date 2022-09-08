import {FiSearch} from "react-icons/fi";

const SearchInput = ({className, value, onChange}) => {
    return (
        <div className="relative mr-2">
            <input
                className={`form-input ${className}`}
                style={{borderRadius: 4, padding: '8px 8px 8px 32px'}}
                value={value} onChange={onChange} placeholder={'Search'}/>
            <FiSearch className="absolute top-3 left-2.5 text-gray-500"/>
        </div>

    )
}
export default SearchInput