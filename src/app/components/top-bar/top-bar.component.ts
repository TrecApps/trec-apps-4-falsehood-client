import { Component, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@tc/tc-ngx-general';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {

  @Output()
  dataEmitter = new EventEmitter();

  authService: AuthService;

  constructor(authService: AuthService){
    this.authService = authService;
  }

  preData() {
    this.dataEmitter.emit("");
  }
}
