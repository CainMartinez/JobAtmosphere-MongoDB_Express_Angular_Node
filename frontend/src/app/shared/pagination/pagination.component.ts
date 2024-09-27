import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Output()
  paginationEvent: EventEmitter<any> = new EventEmitter();

  @Input()
  numItems?: number;

  @Input()
  numItemsXPage!: number;

  numPages!: number;
  currentPage: number = 1; // Variable para llevar el seguimiento de la página actual
  showPagination: boolean = true; // Variable para controlar la visibilidad de la paginación

  constructor() {}
  
  ngOnInit(): void {
    this.loadPagination();
  }

  ngOnChanges() {
    this.loadPagination();
  }

  loadPagination() {
    if(this.numItems && this.numItemsXPage) {
      this.numPages = Math.ceil(this.numItems / this.numItemsXPage);
      this.showPagination = this.numItems > this.numItemsXPage; // Mostrar paginación solo si hay más elementos que el límite por página
    }
  }

  changePage(page: number) {
    if (page < 1 || page > this.numPages) return; // Verifica que la página esté dentro del rango válido
    this.currentPage = page;
    const limitAndOffset: any = {};
    limitAndOffset['limit'] = this.numItemsXPage;
    limitAndOffset['offset'] = this.numItemsXPage * (page - 1);
    this.paginationEvent.emit(limitAndOffset);
  }

  getRange(num: number): number[] {
    return Array.from({ length: num }, (_, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.numPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
}