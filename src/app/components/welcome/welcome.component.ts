import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '@tc/tc-ngx-general';
import { environment } from '../../environment/environment';
import { TopBarComponent } from '../top-bar/top-bar.component';

interface GuidelineEntry{
  label: string;
  content: string;
}

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, TopBarComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  authService: AuthService;

  imageEndpoint: string = environment.IMAGE_SERVICE_URL;

  constructor(authService: AuthService, private client: HttpClient){
    this.authService = authService;
    this.prepGuidelines();
  }

  prepGuidelines(){
    this.client.get<GuidelineEntry[]>('assets/welcome-en-us.json').subscribe((entries: GuidelineEntry[]) => {
      this.guidelines = entries;
    })
  }

  guidelines: GuidelineEntry[] = [];
}
