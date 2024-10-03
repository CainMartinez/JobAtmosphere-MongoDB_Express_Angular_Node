import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { UserService } from '../../../core/services/user.service';

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
  ) {}

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
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
  }

  nav_bars() {
    this.bars = !this.bars;
  }
}