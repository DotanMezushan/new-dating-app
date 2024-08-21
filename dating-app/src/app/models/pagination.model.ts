export class Pagination {
    public currentPage!: number;
    public itemsPerPage!: number;
    public totalItems!: number;
    public totalPages!: number;

    constructor() {
         this.currentPage = 0;
         this.itemsPerPage = 5
         this.totalItems = 1;
         this.totalPages  = 0;
    }
}

export class PaginatedResult<T> {
    result!: T;
    pagination!: Pagination;
}