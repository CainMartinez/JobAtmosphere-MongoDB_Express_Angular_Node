import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./profile.component.css']

})
export class ProfileComponent implements OnInit {
    user: User = {} as User;
    profileForm: FormGroup;
    errors: Object = {};
    isSubmitting = false;
    showSettings = false;
    buttonText = 'Settings';

    constructor(
        private router: Router,
        private userService: UserService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        // create form group using the form builder
        this.profileForm = this.fb.group({
            image: '',
            username: '',
            bio: '',
            email: '',
            password: ''
        });
    }

    ngOnInit() {
        // Obtener el perfil del usuario desde el servicio
        this.userService.getUserProfile().subscribe({
            next: (userProfile) => {
                // Asignar los datos del perfil del usuario
                this.user = userProfile;
                // Asegúrate de que favoriteJobs sea un array
                this.user.favoriteJobs = this.user.favoriteJobs || [];
                // Rellenar el formulario con los datos del usuario
                this.profileForm.patchValue(this.user);
                // Forzar la detección de cambios
                this.cd.detectChanges();
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load user profile. Please try again later.'
                });
            }
        });
    }

    toggleSettings() {
        this.showSettings = !this.showSettings;
        this.buttonText = this.showSettings ? 'Details' : 'Settings';
    }

    logout() {
        this.userService.logout().subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Logged out successfully',
                    text: 'See you soon!'
                }).then(() => {
                    this.router.navigateByUrl('/');
                });
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Logout failed',
                    text: 'Please try again later.'
                });
            }
        });
    }

    submitForm() {
        this.isSubmitting = true;

        // update the model
        this.updateUser(this.profileForm.value);

        this.userService.update(this.user).subscribe({
            next: (updatedUser) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Profile successfully updated'
                }).then(() => {
                    this.router.navigateByUrl('/home');
                });
            },
            error: (err) => {
                this.errors = err;
                this.isSubmitting = false;
                this.cd.markForCheck();
            }
        });
    }

    updateUser(values: Object) {
        Object.assign(this.user, values);
    }
}