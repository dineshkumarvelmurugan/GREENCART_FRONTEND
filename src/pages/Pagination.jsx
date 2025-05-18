import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div id="paginationd">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`pagination-button ${
                    currentPage === 1 
                        ? 'pagination-button-disabled' 
                        : 'pagination-button-active'
                }`}
            >
                <span>Prev</span>
            </button>

            <div id="cur-page">
                {currentPage}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`pagination-button ${
                    currentPage === totalPages 
                        ? 'pagination-button-disabled' 
                        : 'pagination-button-active'
                }`}
            >
                <span>Next</span>
            </button>
        </div>
    );
};

export default Pagination;