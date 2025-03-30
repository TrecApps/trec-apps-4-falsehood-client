import { Component } from '@angular/core';
import { FalsehoodService } from '../../services/falsehood.service';
import { AuthService } from '@tc/tc-ngx-general';
import { CommonModule } from '@angular/common';
import { BrandInfo, BrandInfoImg } from '../../model/BrandInfo';
import { FormsModule } from '@angular/forms';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';

@Component({
  selector: 'app-falsehood',
  imports: [CommonModule, BrandSearcherComponent],
  templateUrl: './falsehood.component.html',
  styleUrl: './falsehood.component.css'
})
export class FalsehoodComponent {
  falsehoodService: FalsehoodService;
  authService: AuthService;

  constructor(falsehoodService: FalsehoodService, authService: AuthService){
    this.falsehoodService = falsehoodService;
    this.authService = authService;
  }

  META = 1;
  CONTENT = 2;
  BRIEFS = 3;

  mode = 1;

  setMode(mode: number){
    this.mode = mode;
  }

  canSubEdit(): boolean {
    return false;
  }

  canEmpEdit(): boolean {
    return false;
  }

  editingPF: boolean = false;
  publicFigure: BrandInfoImg | undefined;
  changedPf(): boolean {
    if(!this.falsehoodService.currentFalsehood) return false;

    let pf = this.falsehoodService.currentFalsehood.fullMetaData?.publicFigure;
    if(pf){
      return pf.id != this.publicFigure?.brandInfo.id;
    }
    return Boolean(this.publicFigure?.brandInfo);
  }
  updatePublicFigure(){
    this.falsehoodService.runPatch("publicFigure", this.publicFigure?.brandInfo.id || "", () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.publicFigure = this.publicFigure?.brandInfo;
    })
  }
}
