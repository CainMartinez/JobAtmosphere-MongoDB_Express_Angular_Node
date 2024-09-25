import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  all_categories(params: any): Observable<Category[]> {
    console.log('Fetching all categories with params:', params);
    return this.http.get<Category[]>(`${environment.URL}/categories`, { params }).pipe(
      tap(categories => console.log('Received categories:', categories))
    );
  }

  all_categories_select(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.URL}/categories_select_filter`)
  }

  // get_category(id: String): Observable<Category> {
  //   return this.http.get<Category>(`${URL}/${id}`);
  // }

  // create_category(category: Category): Observable<Category[]> {
  //   return this.http.post<Category[]>(URL, category);
  // }

  // delete_category(id: String): Observable<Category[]> {
  //   return this.http.delete<Category[]>(`${URL}/${id}`);
  // }
  
  // delete_all_categories(): Observable<Category[]> {
  //   return this.http.delete<Category[]>(`${URL}`);
  // }
}

export { Category };