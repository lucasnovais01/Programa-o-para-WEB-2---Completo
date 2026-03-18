
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
      Mostrando
      <span>
        { pageSize * (page - 1) + 1 }
      </span>
    </p>

    </>
  );
};

export default PaginationInfo;