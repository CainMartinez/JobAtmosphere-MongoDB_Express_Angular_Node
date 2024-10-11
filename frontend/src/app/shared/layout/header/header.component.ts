import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  bars: Boolean = false;
  logged: Boolean = false;
  currentUser: User = {} as User;

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        this.logged = !!userData.username;
        this.cd.markForCheck();
      }
    );
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

  nav_bars() {
    this.bars = !this.bars;
  }
}