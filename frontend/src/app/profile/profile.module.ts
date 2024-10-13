import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../shared';
import { profileRoutingModule } from './profile-routing.module';

@NgModule({
    imports: [
        CommonModule, 
        SharedModule,
        profileRoutingModule
    ],
    declarations: [
        ProfileComponent
    ]
})
export class ProfileModule { }