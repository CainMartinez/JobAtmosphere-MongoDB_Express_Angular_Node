import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { CompanyService } from '../core/services/company.service';
import { RecruiterService } from '../core/services/recruiter.service';
import { UserTypeService } from '../core/services/user-type.service';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Errors } from '../core/models/errors.model';
import { User } from '../core/models/user.model';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
    authType: string = '';
    title: string = '';
    errors: string[] = [];
    isSubmitting = false;
    authForm: FormGroup;
    selectedUserType: string = 'cliente';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private companyService: CompanyService,
        private recruiterService: RecruiterService,
        private userTypeService: UserTypeService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        // use FormBuilder to create a form group
        this.authForm = this.fb.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    ngOnInit() {
        this.route.url.subscribe((data) => {
            this.authType = data[data.length - 1].path;
            this.title = this.authType === 'login' ? 'Log in' : 'Register';
            if (this.authType === 'register') {
                this.authForm.addControl('username', new FormControl());
            }
            this.cd.markForCheck();
        });
    }

    submitForm() {
        this.isSubmitting = true;
        this.errors = [];
        const credentials = this.authForm.value;

        let authObservable: Observable<any>;

        switch (this.selectedUserType) {
            case 'client':
                authObservable = this.userService.attemptAuth(this.authType, credentials);
                break;
            case 'company':
                authObservable = this.companyService.attemptAuth(this.authType, credentials);
                break;
            case 'recruiter':
                authObservable = this.recruiterService.attemptAuth(this.authType, credentials);
                break;
            default:
                this.errors.push('You must select a user type.');
                this.isSubmitting = false;
                return;
        }
        authObservable.subscribe({
            next: (response) => {
                console.log(response);
                const token = response?.user?.token || response?.token;
                const decodedToken: any = jwtDecode(token);

                if (decodedToken && decodedToken.typeuser) {
                    this.userTypeService.setUserType(decodedToken.typeuser);
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: this.authType === 'login' ? 'Login successful' : 'Registration successful'
                }).then(() => {
                    if (this.authType === 'login') {
                        // Redirigir al home después de un login exitoso
                        this.router.navigateByUrl('/home');
                    } else {
                        // Redirigir al login después de un registro exitoso
                        this.router.navigateByUrl('/login');
                    }
                });
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