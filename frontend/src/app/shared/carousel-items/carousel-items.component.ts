import { Component, Input, OnInit } from '@angular/core';
import { CarouselConfig } from 'src/app/core/models/carousel.model';

@Component({
  selector: 'app-carousel-items',
  templateUrl: './carousel-items.component.html',
  styleUrls: ['./carousel-items.component.css']
})
export class CarouselItemsComponent implements OnInit {
  @Input() config!: CarouselConfig;

  selectIndex = 0;
  selectIndex_job_img = 0;

  constructor() {}

  ngOnInit(): void {}
}