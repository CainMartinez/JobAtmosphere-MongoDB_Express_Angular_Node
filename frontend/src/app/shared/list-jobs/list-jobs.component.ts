import { Component, OnInit } from '@angular/core';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-list-jobs',
  templateUrl: './list-jobs.component.html',
  styleUrls: ['./list-jobs.component.css']
})

export class ListJobsComponent implements OnInit {

  jobs: Job[] = [];
  slug_Category!: string | null;
  listCategories: Category[] = [];

  constructor(
    private jobService: JobService, 
    private activatedRoute: ActivatedRoute, 
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.slug_Category = this.activatedRoute.snapshot.paramMap.get('slug');
    
    if (this.slug_Category) {
      this.get_job_by_cat();
    } else {
      this.getAllJobs();
    }
  }
  get_job_by_cat(): void {
    if (this.slug_Category !== null) {
      this.jobService.getJobsByCategory(this.slug_Category).subscribe(
        (data: any) => {
          console.log('API response:', data); // Verifica la respuesta completa de la API
          if (data && data.jobs) {
            this.jobs = data.jobs;
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
        console.log(this.jobs);
      },
      (error: any) => {
        console.error('Error fetching all jobs:', error);
      }
    );
  }
}