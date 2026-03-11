export class Page<T> {
  /* o <T> é classe genérico */
  content: T[];
  totalPages: number;
  totalElements: number;
  pageSize: number;
  page: number;
  lastPage: number;

  private constructor(
    content: T[],
    totalPages: number,
    totalElements: number,
    pageSize: number,
    page: number,
    lastPage: number,
  ) {
    this.content = content;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.pageSize = pageSize;
    this.page = page;
    this.lastPage = lastPage;
  }
}
