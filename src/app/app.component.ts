import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService, BackendService } from '@tc/tc-ngx-general';
import { environment } from './environment/environment';
import { UrlService } from './services/url.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'trecapps-falsehoods';

  authService: AuthService;
  router: Router;

  constructor(authService: AuthService, private backEndService: BackendService, router: Router, private urlService: UrlService) {
    this.authService = authService;
    this.router = router;


    this.backEndService.appendUrl("UserService", environment.USER_SERVICE_URL);
    this.backEndService.setAppName(environment.app_name);
    this.authService.setLogOnAction(() => {
      if(urlService.params) {
        this.router.navigate([this.urlService.url], {
          queryParams: this.urlService.params
        })
      } else {
        this.router.navigate([this.urlService.url])
      }
    })
    this.authService.attemptRefresh(undefined);
  }
}
