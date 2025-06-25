import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrandInfo, BrandInfoImg, ResourceType } from '../../model/BrandInfo';
import { AuthService, StylesService } from '@tc/tc-ngx-general';
import { Observable } from 'rxjs';
import { ResourceService } from '../../services/resource.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-searcher',
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-searcher.component.html',
  styleUrl: './brand-searcher.component.css'
})
export class BrandSearcherComponent {
  @Input()
  type: string | undefined;

  @Output()
  brandInfoSelected = new EventEmitter<BrandInfoImg>();

  @Input()
  label: string = "Search Brand";

  name: string = "";

  entries: BrandInfoImg[] = [];

  showOptions: boolean = true;

  authService: AuthService;

  styleService: StylesService;

  constructor(private brandGetService: ResourceService, authService: AuthService, ss: StylesService){
    this.styleService = ss;
    this.authService = authService;
  }

  isBrandType(brandInfo: BrandInfo, type: ResourceType): boolean {
    return type == brandInfo.resourceTypePrimary || type == brandInfo.resourceTypeSecondary || type == brandInfo.resourceTypeTertiary;
  }

  getBrandType(brandInfo: BrandInfo) : string {
    // console.log("Brand Passed: ", brandInfo);
    if(this.isBrandType(brandInfo, ResourceType.PUBLIC_FIGURE))
      return "Public Figure";

    if(this.isBrandType(brandInfo, ResourceType.MEDIA_OUTLET))
      return "Media Outlet";

    if(this.isBrandType(brandInfo, ResourceType.INSTITUTION))
      return "Insitution";

    return "";
  }

  onInputTextedClicked(){
    this.showOptions = true;
  }

  onInputChange() {

    if(!this.type)return;

    let tempName = this.name.trim();
    if(tempName){
      let observable: Observable<BrandInfoImg[]> = this.brandGetService.searchByNameAndType(tempName, this.type);
       observable.subscribe({
        next: (brands: BrandInfoImg[]) => this.entries = brands
       });
    } else {
      this.entries = [];
    }
  }

  onBrandSelected(selection: BrandInfoImg){
    this.showOptions = false;
    this.brandInfoSelected.emit(selection);
  }
}
