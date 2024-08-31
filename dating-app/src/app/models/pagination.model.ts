export class Pagination {
    public currentPage: number = 0;
    public itemsPerPage : number = 5;
    public totalItems : number = 1;
    public totalPages: number = 0;

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