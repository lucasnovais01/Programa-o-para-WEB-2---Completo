type PaginationInfoProps = {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

const PaginationInfo = ({
  page,
  pageSize,
  totalElements,
  totalPages,
}: PaginationInfoProps) => {
  return (
    <>
      <p>
        Mostrando&nbsp;&nbsp;
        <span className="badge background-secondary text-center">
          {totalElements === 0 ? 0 : pageSize * (page - 1) + 1}
        </span>
        &nbsp;até&nbsp;
        <span className="badge background-secondary ">
          {Math.min(pageSize * page, totalElements)}
        </span>
        &nbsp;de&nbsp;
        <span className="badge background-secondary ">{totalElements}</span>
        &nbsp;registros em&nbsp;
        <span className="badge background-secondary ">{totalPages}</span>
        &nbsp;página{totalPages === 1 ? '' : 's'}
      </p>
    </>
  );
};

export default PaginationInfo;
