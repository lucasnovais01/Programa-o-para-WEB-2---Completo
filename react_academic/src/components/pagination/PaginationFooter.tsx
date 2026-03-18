import Pagination from "./Pagination";
import PaginationInfo from "./PaginationInfo";

type PaginationFooterProps = {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (value: number) => void;
}

const PaginationFooter = ({
  currentPage,
  pageSize,
  totalElements,
  totalPages,
  onPageChange, // está verde pq e uma funcao
}: PaginationFooterProps) => {

  console.log(totalElements);

  return (
    <>
      <div>
        <PaginationInfo
          page = {currentPage}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
        />
      </div>
      <div>
        <Pagination/>
      </div>
    </>
  );
};

export default PaginationFooter;