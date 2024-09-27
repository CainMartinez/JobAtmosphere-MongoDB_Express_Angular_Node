import { Component, OnInit } from '@angular/core';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { Filters } from 'src/app/core/models/filters.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-jobs',
  templateUrl: './list-jobs.component.html',
  styleUrls: ['./list-jobs.component.css']
})

export class ListJobsComponent implements OnInit {

  jobs: Job[] = [];
  slug_Category!: string | null;
  listCategories: Category[] = [];
  routeFilters!: string | null;
  filters = new Filters();
  offset: number = 0;
  limit: number = 2;
  totalPages: Array<number> = [];
  currentPage: number = 1;
  lastParams!: Filters;
  numItems?: number;
  totalJobs: number = 0;

  constructor(
    private jobService: JobService, 
    private activatedRoute: ActivatedRoute, 
    private categoryService: CategoryService,
    private location: Location // Asegúrate de inyectar el servicio Location
  ) {}

  ngOnInit(): void {
    this.slug_Category = this.activatedRoute.snapshot.paramMap.get('slug');
    this.getListForCategory();   
    this.get_list_filtered({ limit: this.limit, offset: 0 });
 
  
      if(this.slug_Category !== null) {
        this.get_job_by_cat();
      }
      else if(this.routeFilters !== null){
        this.refreshRouteFilter();
        this.get_list_filtered(this.filters);
      }else{
        // console.log(window.location.href);
        this.get_list_filtered(this.filters);
      }
  }

  get_job_by_cat(): void {
    if (this.slug_Category !== null) {
      this.jobService.getJobsByCategory(this.slug_Category).subscribe(
        (data: any) => {
          console.log('API response:', data); // Verifica la respuesta completa de la API
          if (data && data.jobs && data.Job_count !== undefined && data.Job_count !== null) {
            this.jobs = data.jobs;
            this.totalJobs = data.Job_count; // Actualiza el valor de totalJobs
            this.totalPages = Array.from(new Array(Math.ceil(data.Job_count / this.limit)), (val, index) => index + 1);
            console.log('Jobs:', this.jobs); // Verifica los trabajos recibidos
          } else {
            console.error('No jobs found in the response');
          }
        },
        (error: any) => {
          console.error('Error fetching jobs by category:', error);
        }
      );
    }
  }
  
  getAllJobs(): void {
    this.jobService.get_jobs().subscribe(
      (data: any) => {
        if (Array.isArray(data.jobs)) {
          this.jobs = data.jobs;
        } else {
          console.error('Data.jobs is not an array');
        }
        console.log("Get ALL jobs",this.jobs);
      },
      (error: any) => {
        console.error('Error fetching all jobs:', error);
      }
    );
  }

  get_list_filtered(filters: any) {
    this.filters = filters;
    this.jobService.get_jobs_filter(filters).subscribe(
      (data: any) => {
        console.log('API response:', data); // Verifica la respuesta completa de la API
        if (data && data.jobs && data.Job_count !== undefined && data.Job_count !== null) {
          this.jobs = data.jobs;
          this.totalJobs = data.Job_count; // Actualiza el valor de totalJobs
          const totalPagesCount = Math.ceil(data.Job_count / this.limit);
          this.totalPages = Array.from(new Array(totalPagesCount), (val, index) => index + 1);
          // console.log(this.jobs);
        } else {
          console.error('La respuesta no contiene la propiedad jobs o Job_count:', data);
        }
      },
      (error) => {
        console.error('Error al obtener los trabajos:', error);
      }
    );
  }
  
  // Agarrar les categories pa els filtros
  getListForCategory() {    
    this.categoryService.all_categories_select().subscribe(
      (data: any) => {
        this.listCategories = data.categories;
      }
    );
  }

  refreshRouteFilter() {
    this.routeFilters = this.activatedRoute.snapshot.paramMap.get('filters');
    if (typeof(this.routeFilters) === "string") {
      this.filters = JSON.parse(atob(this.routeFilters));
    } else {
      this.filters = new Filters();
    }
  }

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;

    if (typeof this.routeFilters === 'string') {
      this.refreshRouteFilter();
    }

    if (this.limit) {
      this.filters.limit = this.limit;
      this.filters.offset = this.limit * (this.currentPage - 1);
    }

    this.location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));
    // console.log(this.Location);
    this.get_list_filtered(this.filters);
  }
  testPagination(data: any) {
    let params: any = {};
    if (this.lastParams) {
      params = this.lastParams;
    }
    params['limit'] = data.limit;
    params['offset'] = data.offset;
    this.get_list_filtered(params);
  }
}