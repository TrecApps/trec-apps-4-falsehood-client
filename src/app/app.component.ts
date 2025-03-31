import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService, BackendService } from '@tc/tc-ngx-general';
import { environment } from './environment/environment';

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

  constructor(authService: AuthService, private backEndService: BackendService, router: Router) {
    this.authService = authService;
    this.router = router;


    this.backEndService.appendUrl("UserService", environment.USER_SERVICE_URL);
    this.backEndService.setAppName(environment.app_name);
    this.authService.setLoginSuccessRoute("Welcome");
    this.authService.attemptRefresh(undefined);
  }
}
