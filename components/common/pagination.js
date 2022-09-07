import ReactPaginate from "react-paginate";

const Pagination = ({page, total, limit, totalPages, onPageChange}) => {
    return (
        <div className="flex justify-between mb-4">
            <p className="mb-0 text-sm text-gray-500">
                Showing { ((page - 1) * limit) + 1 || 0}
                to {Math.min(total || 0, (page * limit) || 0)} of {total || 0} entries
            </p>
            <ReactPaginate
                breakLabel="..."
                previousLabel="Previous"
                disabledLinkClassName="text-gray-300"
                previousLinkClassName="text-sm bg-gray-100  hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-l"
                nextLinkClassName="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-r"
                pageLinkClassName="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4"
                activeLinkClassName="text-primary"
                nextLabel="Next"
                className="flex"
                onPageChange={({selected}) => onPageChange(selected + 1)}
                pageRangeDisplayed={5}
                pageCount={totalPages || 1}
                renderOnZeroPageCount={null}
            />
        </div>
    )
}
export default Pagination