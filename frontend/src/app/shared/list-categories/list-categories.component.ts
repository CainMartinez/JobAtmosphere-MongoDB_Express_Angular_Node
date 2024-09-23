import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service'
import { Category } from 'src/app/core/models/category.model';
import { offset } from '@popperjs/core';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit {
  
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  //INICIA 

  ngOnInit(): void {
    this.getCategories();
  }

  // TOTES LES CATEGORIES
  getCategories() {
    this.categoryService.all_categories({}).subscribe(
      (data: any) => {
        if (data && Array.isArray(data.categories)) {
          this.categories = data.categories;
          console.log('Categories in component:', this.categories);
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }
}