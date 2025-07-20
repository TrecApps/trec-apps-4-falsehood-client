import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  url: string = "/Welcome";

  params: any | undefined;

  constructor() { }
}
