import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@tc/tc-ngx-general';
import { StylesService } from '../../services/styles.service';
import { Observable, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { Factcheck, FalsehoodStage } from '../../model/Factcheck';
import { FactcheckService } from '../../services/factcheck.service';
import ResponseObj from '../../model/ResponseObj';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-factcheck-search',
  imports: [CommonModule, FormsModule, TopBarComponent],
  templateUrl: './factcheck-search.component.html',
  styleUrl: './factcheck-search.component.css'
})
export class FactcheckSearchComponent implements OnDestroy{

  prepData(){
    this.pageSize = 2;
    let fList:Factcheck[] = [];


    fList.push({
      id: '1',
      name: 'Title1',
      userId: '',
      brandId: undefined,
      authorDisplayName: 'Obi-Wan',
      created: new Date(),
      published: new Date(),
      status: FalsehoodStage.SAVED,
      records: [],
      tags: ["One", "uno", "une"]
    },{
      id: '2',
      name: 'Title2',
      userId: '',
      brandId: undefined,
      authorDisplayName: 'Padme',
      created: new Date(),
      published: new Date(),
      status: FalsehoodStage.SAVED,
      records: [],
      tags: ["Two", "douze", "deux"]
    });

    this.factcheckContainer = [];
    this.factcheckContainer.push(fList);

    this.currentFactcheckList = fList;
    this.factcheckContainer.push([
      {
        id: '3',
        name: 'Title3',
        userId: '1',
        brandId: undefined,
        authorDisplayName: 'Steve Rogers',
        created: new Date(),
        published: new Date(),
        status: FalsehoodStage.SAVED,
        records: [],
        tags: ["three", "triez", "trois"]
      }
    ])
  }

  styleService: StylesService;
  authService: AuthService;
  routerSubscription: Subscription;

  isAuthenticated: boolean = false;
  mode: string = "query";

  query: string = "";

  pageSize: number = 20;
  currentPage: number = 0;


  factcheckContainer: Factcheck[][] = [];
  currentFactcheckList: Factcheck[] = [];

  constructor(ss: StylesService, authService: AuthService, private router: Router, private factcheckService: FactcheckService){
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

  onSelect(factcheck:Factcheck){
    this.factcheckService.getFactcheck(factcheck.id).subscribe({
      next: (value: ResponseObj) => {
        // ToDo: Navigate to Factcheck
        this.factcheckService.currentFactcheck = factcheck;
        this.factcheckService.currentContents = value.message;
        
      }
    })
  }


  performSearch(){  
    this.currentPage = 0;
    this.factcheckContainer = [];
    this.currentFactcheckList = [];
    this.doSearch();
  }

  isSearching: boolean = false;
  doSearch(){
    if(this.isSearching) return;
    let results: Observable<Factcheck[]>;
    if(this.mode == 'query'){
      results = this.factcheckService.searchFactcheckByQuery(this.query,this.currentPage, this.pageSize);
    } else {
      results = this.factcheckService.searchFactCheckByMode(this.mode, this.currentPage, this.pageSize);
    }

    this.isSearching = true;

    results.subscribe({
      next: (value: Factcheck[]) => {
        this.factcheckContainer.push(value);
        this.currentFactcheckList = value;
        this.isSearching = false;
      },
      error: () => {
        this.isSearching = false;
      }
    });
  }

  onSwitchPage(next: boolean){
    if(this.isSearching) return;
    if(next){
      this.currentPage++;
      if(this.currentPage == this.factcheckContainer.length){
        // We need to do another search
        this.doSearch();
      } else {
        this.currentFactcheckList = this.factcheckContainer[this.currentPage];
      }
    } else {
      if(this.currentPage > 0) {
        this.currentFactcheckList = this.factcheckContainer[--this.currentPage];
      }
    }
  }

  hasMore(): boolean{
    return (this.factcheckContainer[this.factcheckContainer.length - 1].length == this.pageSize)
  }




}
