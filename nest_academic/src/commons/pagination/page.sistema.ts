import { Pageable } from './page.response';

export class Page<T> {
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
  ) {
    this.content = content;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.pageSize = pageSize;
    this.page = page;
    this.lastPage = totalPages;
  }

  static of<T>(
    content: T[],
    totalElements: number,
    pageable: Pageable,
  ): Page<T> {
    const pageSize = pageable.pageSize;
    const page = pageable.page;
    const totalPages = Math.ceil(totalElements / pageSize);
    return new Page(content, totalPages, totalElements, pageSize, page);
  }
}
