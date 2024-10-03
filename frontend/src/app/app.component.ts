import { Component, OnInit } from '@angular/core';
import { UserService } from '../app/core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TicJobsNet';
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.populate();
  };
}
