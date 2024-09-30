export interface CarouselHome {
    slug?: String;
    image?: String;
    category_name?: String;
  }
  
export interface CarouselDetails {
    images?: String;
  }
export interface CarouselConfig {
  categories?: CarouselHome[];
  jobs_details?: CarouselDetails[];
  page?: string;
}