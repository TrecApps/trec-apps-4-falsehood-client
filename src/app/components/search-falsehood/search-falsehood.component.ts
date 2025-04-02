import { Component } from '@angular/core';
import { FalsehoodService } from '../../services/falsehood.service';
import { BrandInfo, BrandInfoImg, ResourceType } from '../../model/BrandInfo';
import { StylesService } from '../../services/styles.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';
import { AuthService } from '@tc/tc-ngx-general';
import { SearchOptionFilterPipe, SearchStatusOption } from '../../pipes/search-option-filter.pipe';
import { FalsehoodRet } from '../../model/Falsehood';
import { Observable } from 'rxjs';
import { TopBarComponent } from '../top-bar/top-bar.component';


@Component({
  selector: 'app-search-falsehood',
  imports: [CommonModule, FormsModule, BrandSearcherComponent, SearchOptionFilterPipe, TopBarComponent],
  templateUrl: './search-falsehood.component.html',
  styleUrl: './search-falsehood.component.css'
})
export class SearchFalsehoodComponent {


  prepData(){

  }

  falsehoodService: FalsehoodService;

  styleService: StylesService;

  authService: AuthService

  searchOptions: SearchStatusOption[] = [
    {status: "owned", displayStatus: "Your Submissions", requiresAuth: true},
    {status: "submitted", displayStatus: "Submitted Falsehoods", requiresAuth: true},
    {status: "rejected", displayStatus: "Rejected Falsehoods", requiresAuth: false},
    {status: "accepted", displayStatus: "Accepted Falsehoods", requiresAuth: false},
    {status: "denied", displayStatus: "Denied Falsehoods", requiresAuth: false},
    {status: "confirmed", displayStatus: "Confirmed Falsehoods", requiresAuth: false},
    {status: "appealed1", displayStatus: "First Review Appealed", requiresAuth: true},
    {status: "appealed2", displayStatus: "Second Review Appealed", requiresAuth: true},
  ]

  searchOption: SearchStatusOption = this.searchOptions[5];

  constructor(fs: FalsehoodService, ss: StylesService, authService: AuthService){
    this.falsehoodService = fs;
    this.styleService = ss;
    this.authService = authService;
  }

  canMake(searchOption: SearchStatusOption): boolean {
    if(!searchOption.requiresAuth) return true;

    let user = this.authService.tcUser;
    if(!user || user.credibilityRating === undefined) {
      return false; // Wee need authentication, but don't have it
    }

    return true;
  }

    isBrandType(brandInfo: BrandInfo, type: ResourceType): boolean {
      return type == brandInfo.resourceTypePrimary || type == brandInfo.resourceTypeSecondary || type == brandInfo.resourceTypeTertiary;
    }
  
    getBrandType(brandInfo: BrandInfo) : string {
      if(this.isBrandType(brandInfo, ResourceType.PUBLIC_FIGURE))
        return "Public Figure";
  
      if(this.isBrandType(brandInfo, ResourceType.MEDIA_OUTLET))
        return "Media Outlet";
  
      if(this.isBrandType(brandInfo, ResourceType.INSTITUTION))
        return "Insitution";
  
      return "";
    }


  setBrandInfo(value: BrandInfoImg | undefined) {
    this.brandInfo = value;
  }

  // 
  brandInfo: BrandInfoImg | undefined;

  useBefore: boolean = false;
  before: Date | undefined;
  useAfter: boolean = false;
  after: Date | undefined;

  pageSize: number = 20;

  currentPage: number = 0;

  // Results
  falsehoodCollection: FalsehoodRet[][] = [];
  currentFalsehoodList: FalsehoodRet[] = [];

  // Whether or not a search is underway
  isSearching = false;

  clearFields(){
    this.brandInfo = undefined;
    this.before = this.after = undefined;
    this.useBefore = this.useAfter = false;
    this.pageSize = 20;
    this.currentPage = 0;
    this.falsehoodCollection = [];
    this.currentFalsehoodList = [];
  }

  performSearch(){
    this.currentPage = 0;
    this.falsehoodCollection = [];
    this.currentFalsehoodList = [];

    this.doSearch();
  }

  doSearch(){
    if(this.isSearching) return;

    let ret: Observable<FalsehoodRet[]> | undefined;

    if(!this.brandInfo?.brandInfo){
      ret = this.falsehoodService.searchByFields(
        this.searchOption.status, 
        this.useBefore ? this.before : undefined,
        this.useAfter ? this.after: undefined,
        this.currentPage,
        this.pageSize
      )
    } else if(this.isBrandType(this.brandInfo.brandInfo, ResourceType.PUBLIC_FIGURE)) {
      ret = this.falsehoodService.searchByPublicFigure(
        this.searchOption.status,
        this.brandInfo.brandInfo.id,
        this.useBefore ? this.before : undefined,
        this.useAfter ? this.after: undefined,
        this.currentPage,
        this.pageSize
      )
    } else if(this.isBrandType(this.brandInfo.brandInfo, ResourceType.MEDIA_OUTLET)) {
      ret = this.falsehoodService.searchByMediaOutlet(
        this.searchOption.status,
        this.brandInfo.brandInfo.id,
        this.useBefore ? this.before : undefined,
        this.useAfter ? this.after: undefined,
        this.currentPage,
        this.pageSize
      )
    } else if(this.isBrandType(this.brandInfo.brandInfo, ResourceType.INSTITUTION)) {
      ret = this.falsehoodService.searchByInstitution(
        this.searchOption.status,
        this.brandInfo.brandInfo.id,
        this.useBefore ? this.before : undefined,
        this.useAfter ? this.after: undefined,
        this.currentPage,
        this.pageSize
      )
    }

    if(!ret) {
      console.warn("Selected brand is not a Public Figure, Media Outlet, or Institution");
      return;
    }

    this.isSearching = true;

    ret.subscribe({
      next: (value: FalsehoodRet[]) => {
        this.falsehoodCollection.push(value);
        this.currentFalsehoodList = value;
        this.isSearching = false;
      },
      error: () => {
        this.isSearching = false;
      }
    });
  }

  onSelect(falsehood:FalsehoodRet){
    this.falsehoodService.searchFalsehood(falsehood.id, () => {
      // ToDo: Navigate to Falsehood Present 
    });
  }

  onSwitchPage(next: boolean){
    if(this.isSearching) return;
    if(next){
      this.currentPage++;
      if(this.currentPage == this.falsehoodCollection.length){
        // We need to do another search
        this.doSearch();
      } else {
        this.currentFalsehoodList = this.falsehoodCollection[this.currentPage];
      }
    } else {
      if(this.currentPage > 0) {
        this.currentFalsehoodList = this.falsehoodCollection[--this.currentPage];
      }
    }
  }

  hasMore(): boolean{
    return (this.falsehoodCollection[this.falsehoodCollection.length - 1].length == this.pageSize)
  }

}
