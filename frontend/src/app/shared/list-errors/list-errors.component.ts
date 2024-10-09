import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-list-errors',
    template: '',
})
export class ListErrorsComponent implements OnChanges {
    @Input() errors: string[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['errors'] && this.errors.length > 0) {
            this.showErrors(this.errors);
        }
    }

    showErrors(errors: string[]) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: errors.join('<br>'),
            confirmButtonText: 'OK'
        });
    }
}