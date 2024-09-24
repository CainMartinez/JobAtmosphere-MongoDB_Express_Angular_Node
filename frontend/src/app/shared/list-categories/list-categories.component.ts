import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit {
  offset = 0;
  limit = 3;
  categories: Category[] = [];
  loading = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    if (this.loading) return;
    this.loading = true;

    const params = this.getRequestParams(this.offset, this.limit);

    this.categoryService.all_categories(params).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.categories)) {
          this.categories = [...this.categories, ...data.categories];
          this.offset += this.limit;
        } else {
          console.error('Expected an array but got:', data);
        }
        this.loading = false; // Resetear el estado de carga
      },
      error => {
        console.error('Error fetching categories:', error);
        this.loading = false; // Resetear el estado de carga en caso de error
      }
    );
  }

  getRequestParams(offset: number, limit: number): any {
    let params: any = {};
    params[`offset`] = offset;
    params[`limit`] = limit;
    return params;
  }

  scroll() {
    this.getCategories();
  }
}