import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ListCategoriesComponent } from '../shared/list-categories/list-categories.component';
import { CardCategoryComponent } from '../shared/card-category/card-category.component';
import { ListJobsComponent } from '../shared/list-jobs/list-jobs.component';
import { CardJobComponent } from '../shared/card-job/card-job.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule
    ],
    declarations:[
        ListCategoriesComponent,
        CardCategoryComponent,
        ListJobsComponent,
        CardJobComponent
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        ListCategoriesComponent,
        CardCategoryComponent,
        ListJobsComponent,
        CardJobComponent
    ],
})
export class SharedModule { }