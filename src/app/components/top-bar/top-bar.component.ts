import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@tc/tc-ngx-general';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, RouterLink],
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
    this.dataEmitter.emit();
  }
}
