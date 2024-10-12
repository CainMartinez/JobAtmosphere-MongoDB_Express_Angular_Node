import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from '../shared/list-categories/list-categories.component';
import { CardCategoryComponent } from '../shared/card-category/card-category.component';
import { ListJobsComponent } from '../shared/list-jobs/list-jobs.component';
import { CardJobComponent } from '../shared/card-job/card-job.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { CarouselItemsComponent } from './carousel-items/carousel-items.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from '../shared/search/search.component';
import { FiltersComponent } from './filters/filters.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ListErrorsComponent } from '../shared/list-errors/list-errors.component';
import { FavoriteButtonComponent } from './favorite-button/favorite-button.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        InfiniteScrollModule,
        NgbModule
    ],
    declarations:[
        ListCategoriesComponent,
        CardCategoryComponent,
        ListJobsComponent,
        CardJobComponent,
        CarouselItemsComponent,
        CarouselComponent,
        FiltersComponent,
        SearchComponent,
        PaginationComponent,
        ListErrorsComponent,
        FavoriteButtonComponent
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        ListCategoriesComponent,
        CardCategoryComponent,
        ListJobsComponent,
        CardJobComponent,
        CarouselItemsComponent,
        CarouselComponent,
        FiltersComponent,
        SearchComponent,
        PaginationComponent,
        ListErrorsComponent,
        FavoriteButtonComponent
    ],
})
export class SharedModule { }