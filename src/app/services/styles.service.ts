import { Injectable } from '@angular/core';

export interface StyleOption {
  cssName: string;
  showName: string;
};

const stylesList: StyleOption[] = [
  { cssName: "default", showName: "Default" }
];


@Injectable({
  providedIn: 'root'
})
export class StylesService {

  constructor() { }

  style = "default";

  getAvailableStyles(): StyleOption[] {
    return stylesList;
  }

  isValidStyle(style:string): boolean {
    for(let styleOption of stylesList){
      if(style == styleOption.cssName){ return true; }
    }
    return false;
  }

  setStyle(style: string){
    if(!this.isValidStyle(style)){
      console.warn(`CSS Style ${style} is not a valid style!`);
      return;
    }

    this.style = style;
  }
}
