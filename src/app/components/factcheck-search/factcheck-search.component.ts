import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@tc/tc-ngx-general';
import { StylesService } from '../../services/styles.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Factcheck } from '../../model/Factcheck';

@Component({
  selector: 'app-factcheck-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './factcheck-search.component.html',
  styleUrl: './factcheck-search.component.css'
})
export class FactcheckSearchComponent implements OnDestroy{

  styleService: StylesService;
  authService: AuthService;
  routerSubscription: Subscription;

  isAuthenticated: boolean = false;
  mode: string = "query";

  query: string = "";


  factcheckContainer: Factcheck[][] = [];
  curentFactcheckList: Factcheck[] = [];

  constructor(ss: StylesService, authService: AuthService, private router: Router){
    this.styleService = ss;
    this.authService = authService;

    this.routerSubscription = this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent : NavigationEnd = event;

        if(endEvent.url == '/factcheck-search'){
          this.isAuthenticated = this.authService.hasActiveTokens();
          if(!this.isAuthenticated){
            this.mode = "query";
          }
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }


  performSearch(){

  }
}
