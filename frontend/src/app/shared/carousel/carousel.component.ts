import { Component, OnInit } from '@angular/core';
import { CarouselConfig, CarouselDetails, CarouselHome } from 'src/app/core/models/carousel.model';
import { CarouselService } from 'src/app/core/services/carousel.service';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  config!: CarouselConfig;
  slug_details!: string | null;

  constructor(private CarouselService: CarouselService, private jobService: JobService, private ActivatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug_details = this.ActivatedRoute.snapshot.paramMap.get('slug');
    this.carousel_categories();
    this.carousel_shop_details();
  }

  carousel_categories(): void {
    this.CarouselService.getCarouselHome().subscribe((data: any) => {
      this.config = {
        categories: data.categories,
        page: 'categories'
      };
    });
  }

  carousel_shop_details(): void {
    if (this.slug_details) {
      this.CarouselService.getCarouselDetails(this.slug_details).subscribe((data: any) => {
        this.config = {
          jobs_details: data.jobs.images,
          page: 'details'
        };
      });
    }
  }
}