import { Component, OnInit } from '@angular/core';
import { UserService } from '../app/core/services/user.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DreamJob';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.populate();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}