import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, NavBarComponent, NavClickDetails, NavOption, NavOptionShow } from '@tc/tc-ngx-general';


@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, NavBarComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopBarComponent {

  authService: AuthService;

  navOptions: NavOption[];

  constructor(authService: AuthService, private router:Router){
    this.authService = authService;

    this.navOptions = [
      {
        displayText: 'Welcome',
        title: 'Welcome',
        showOption: NavOptionShow.BASIC_DESKTOP
      },
      {
        displayText: 'Factchecks',
        title: 'factchecks-search',
        showOption: NavOptionShow.BASIC_DESKTOP
      },
      {
        displayText: 'Falsehoods',
        title: 'falsehoods-search',
        showOption: NavOptionShow.BASIC_DESKTOP
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
