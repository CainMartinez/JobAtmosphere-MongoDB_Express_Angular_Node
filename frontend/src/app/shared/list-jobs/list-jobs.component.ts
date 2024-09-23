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
      this.getJobsByCategory();
    } else {
      this.getAllJobs();
    }
  }
  getJobsByCategory(): void {
    if (this.slug_Category) {
      this.jobService.getJobsByCategory(this.slug_Category).subscribe(
        (jobs: Job[]) => {
          console.log('API response:', jobs);
          if (jobs && jobs.length > 0) {
            this.jobs = jobs;
            console.log(this.jobs);
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