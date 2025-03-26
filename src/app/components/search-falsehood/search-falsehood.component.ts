import { Component } from '@angular/core';
import { FalsehoodService } from '../../services/falsehood.service';

@Component({
  selector: 'app-search-falsehood',
  imports: [],
  templateUrl: './search-falsehood.component.html',
  styleUrl: './search-falsehood.component.css'
})
export class SearchFalsehoodComponent {

  falsehoodService: FalsehoodService;

  constructor(fs: FalsehoodService){
    this.falsehoodService = fs;
  }

  

}
