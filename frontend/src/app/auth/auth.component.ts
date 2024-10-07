import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    authType: string = '';
    title: String = '';
    isSubmitting = false;
    authForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.authForm = this.fb.group({
            'email': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    ngOnInit() {
        this.route.url.subscribe(data => {
            this.authType = data[data.length - 1].path;
            this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
            if (this.authType === 'register') {
                this.authForm.addControl('username', new FormControl());
            }
            this.cd.markForCheck();
        });
    }

    submitForm() {
        this.isSubmitting = true;
        const credentials = this.authForm.value;
        this.userService.attemptAuth(this.authType, credentials).subscribe(
            () => {
                this.router.navigateByUrl('/');
            },
            err => {
                this.isSubmitting = false;
                this.cd.markForCheck();
            }
        );
    }
}