import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaFastBackward,
  FaFastForward,
} from 'react-icons/fa';
import './pagination.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (value: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <>
      <div className="pagination">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button onClick={() => onPageChange(1)} className="page-link">
              <FaFastBackward />
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className="page-link"
            >
              <FaArrowAltCircleLeft />
            </button>
          </li>
          {/* {Array.from({ length: totalPages }, (_, index) => (
            <li
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button
                onClick={() => onPageChange(index + 1)}
                className="page-link"
              >
                {index + 1}
              </button>
            </li>
          ))} */}
          {pageNumbers.map((page, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
            >
              <button
                onClick={() => onPageChange(page + 1)}
                className="page-link"
              >
                {page}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="page-link"
            >
              <FaArrowAltCircleRight />
            </button>
          </li>
          <li
            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            <button
              onClick={() => onPageChange(totalPages)}
              className="page-link"
            >
              <FaFastForward />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pagination;

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const windowSize = 4;
  let start: number;
  let end: number;

  //verificar se totalpages é menor ou igual ao windowSize
  if (totalPages <= windowSize) {
    //se o total processado for menor que o windowSize
    //mostrar todas as páginas 9
    // 1,2,3,4,5,6,7,8,9
    start = 1;
    end = totalPages;
  } else {
    //centralizar a barra na página
    start = Math.max(1, currentPage - 4);
    //página em destaque fique sempre ao centro
    end = start + windowSize - 1;
    //ajustar p fim caso ultrapasse o total de páginas
    if (end > totalPages) {
      end = totalPages;
      start = end - windowSize + 1;
    }
  }

  const range: number[] = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
}
