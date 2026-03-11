export class Pageable {
  readonly page: number;
  readonly pageSize: number;
  readonly props: string;
  readonly order: 'ASC' | 'DESC';

  constructor(
    page: number = 1,
    pageSize: number = 5,
    props?: string,
    order?: string,
    private readonly allowedFields: string[] = [],
  ) {
    // iremos fazer uns controles lógicos
    this.page = page < 1 ? 1 : page;
    this.pageSize = pageSize > 100 ? 100 : pageSize;
    const defaultField = allowedFields[0];
    this.props = allowedFields.includes(props ?? '') ? props! : defaultField;
    this.order = order?.toLocaleUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  }
}
