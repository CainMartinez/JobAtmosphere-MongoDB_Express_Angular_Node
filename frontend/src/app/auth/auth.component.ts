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
    errors: string[] = [];
    user!: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.authForm = this.fb.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() {
        this.route.url.subscribe(data => {
            this.authType = data[data.length - 1].path;
            this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
            if (this.authType === 'register') {
                this.authForm.addControl('username', new FormControl('', Validators.required));
            }
            this.cd.markForCheck();
        });
    }

    submitForm() {
        this.isSubmitting = true;
        this.errors = [];
        this.user = this.authForm.value;
        this.userService.attemptAuth(this.authType, this.user).subscribe({
            next: () => {
                this.router.navigateByUrl('/');
            },
            error: (err: any) => {
                this.errors = err.errors ? err.errors : [err.message || 'An error occurred'];
                this.isSubmitting = false;
                this.cd.detectChanges();
            }
        });
    }

    get email() { return this.authForm.get('email'); }
    get password() { return this.authForm.get('password'); }
    get username() { return this.authForm.get('username'); }
}