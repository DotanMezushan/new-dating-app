import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '../models/pagination.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationHelperService {

  constructor() { }

  public getPaginatedReult<T>(url: string, params: HttpParams, http : HttpClient): Observable<PaginatedResult<T>> {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return http
      .get<T>(url, { observe: 'response', params })
      .pipe(
        map((response) => {
          if (response.body) {
            paginatedResult.result = response.body;
          }
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination') as string
            );
          }
          return paginatedResult;
        })
      );
  }

  public getPaginationHeaders(
    pageNumber: number,
    pageSize: number
  ): HttpParams {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }
}
