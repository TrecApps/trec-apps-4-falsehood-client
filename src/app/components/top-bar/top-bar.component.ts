import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, HttpContentType, NavBarComponent, NavClickDetails, NavOption, NavOptionShow, PopupComponent, ProfileItemGroup, ResponseObj, StylesService } from '@tc/tc-ngx-general';
import { environment } from '../../environment/environment';
import { ColorOption, ColorPanelComponent } from '../color-panel/color-panel.component';


@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, NavBarComponent, PopupComponent, ColorPanelComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopBarComponent {

  authService: AuthService;

  navOptions: NavOption[];

    profileItemGroups: ProfileItemGroup[] = [
    {
      itemList: [
        {
          item: 'cStyle',
          displayItem: 'App Style'
        },
        {
          item: 'brand',
          displayItem: 'View Brand Accounts'
        }
      ]
    }, {
      itemList: [
        {
          item: 'logout',
          displayItem: 'Logout'
        }
      ]
    }
  ]

  @ViewChild("navBar")
  navBar!: NavBarComponent;

  onProfilePanelSelect(item:string) {
    if(item == 'logout'){
      this.authService.logout(undefined);
    } else if(item == 'cStyle'){
      this.showStylePopup = true;
    } else if(item == 'brand'){
      this.navBar.onFocusBrands();
    }
  }

  showStylePopup: boolean = false;
  styleUpdating: boolean = false;

  updateStyle(){

    if(this.styleUpdating) return;
      this.styleUpdating = true;

    let targetStyle = this.ss.style;
    if(targetStyle.startsWith('dark-'))
      targetStyle = targetStyle.substring(5);

    this.client.patch<ResponseObj>(`${environment.USER_SERVICE_URL}Users/styles`, {
        style: targetStyle,
        useDark: this.ss.isDark
    
    }, {
      params: new HttpParams().append("app", environment.app_name),
      headers: this.authService.getHttpHeaders2(HttpContentType.JSON)
    }).subscribe({
      next: (val: ResponseObj) => {
        this.styleUpdating = false;
        this.colorChanged = false;
      },
      error: ()=> {
        this.styleUpdating = false;
        this.colorChanged = false;
      }
    })
  }

    colorList: ColorOption[] = [
    {
      colorStyle: '#d1d1d1',
      styleName: 'default'
    },{
      colorStyle: '#ff0000ff',
      styleName: 'red'
    },{
      colorStyle: 'rgb(0, 171, 255)',
      styleName: 'blue'
    },{
      colorStyle: 'rgb(8, 223, 41)',
      styleName: 'green'
    },{
      colorStyle: 'rgb(255, 239, 1)',
      styleName: 'yellow'
    },{
      colorStyle: 'rgb(255, 120, 1)',
      styleName: 'orange'
    },{
      colorStyle: 'rgb(221, 99, 255)',
      styleName: 'purple'
    },{
      colorStyle: 'rgb(255, 59, 243)',
      styleName: 'pink'
    }
  ]

  colorChanged: boolean = false;

  onColorSelect(styleColor: string){
    this.ss.setStyle(styleColor);
    this.colorChanged = true;
  }
  onUseDarkChecked(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.colorChanged = true;

    this.ss.setDarkMode(checkbox.checked);
  }
  
  ss: StylesService;

  constructor(authService: AuthService, private router:Router, ss: StylesService, private client: HttpClient){
    this.authService = authService;
    this.ss = ss;

    this.navOptions = [
      {
        displayText: 'Welcome',
        title: 'Welcome',
        showOption: NavOptionShow.BASIC_DESKTOP,
        baseImg: 'assets/Welcome-icon.png'
      },
      {
        displayText: 'Factchecks',
        title: 'factchecks-search',
        showOption: NavOptionShow.BASIC_DESKTOP,
        baseImg: 'assets/Factcheck-logo-mob.png'
      },
      {
        displayText: 'Falsehoods',
        title: 'falsehoods-search',
        showOption: NavOptionShow.BASIC_DESKTOP,
        baseImg: 'assets/Falsehood-icon-mob.png'
      }
      // ,
      // {
      //   displayText: 'Welcome',
      //   title: 'Welcome',
      //   showOption: NavOptionShow.BASIC_DESKTOP
      // }
    ]
  }



  onNavigate(details: NavClickDetails){
    this.router.navigateByUrl('/' + (details.navLink || details.title));
  }

  prepLogin(){
    this.router.navigateByUrl('/Logon')
  }

  createFalsehood(){
    this.router.navigateByUrl('/falsehood-submit');
  }
}
