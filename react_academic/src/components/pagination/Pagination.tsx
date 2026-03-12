import './pagination.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (value: number) => void;
}

const Pagination = ({
  currentPage,  //1,2,3,4,5
  totalPages,
  onPageChange,

}: PaginationProps) => {

  if (totalPages <= 1) {
    return null;
  }

  return (
    <>
      <div className='pagination'>
        Paginação.

      </div>
    </>
  )
}

export default Pagination;