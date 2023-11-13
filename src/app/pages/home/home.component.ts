import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/components/shared/angular-material/global-constants';

//import { takeUntil } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
//import { DotusService } from '../../services/dotus.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public loading: Boolean = false;

  mensaje:string = "Menu Principal.";
  //public error: { code: number, message: string } = null

  constructor(
    private auth: AuthService,
    private router: Router,
    //private dotus: DotusService
  ) {
    //this.getAllOptions();
  }

  ngOnInit(): void {}

  salir() {
    this.auth.logout();
    GlobalConstants.options = [];
    this.router.navigateByUrl('/login');
  }

}
