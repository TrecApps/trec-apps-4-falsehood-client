import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@tc/tc-ngx-general';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { BrandInfoImg, BrandInfo, ResourceMetadata } from '../model/BrandInfo';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private authService: AuthService,
    private client: HttpClient,
//    private router: Router  
  ) {}


  searchByNameAndType(name:string, type: string): Observable<BrandInfoImg[]>{
    let params = new HttpParams().append("name", name);

    return this.client.get<BrandInfoImg[]>(`${environment.RESOURCE_URL}search/resourceByType/${type}`, {
      params
    })
  }

  selectEntry(bi: BrandInfo, onContent: Function, onMetadata: Function){


    this.client.get(`${environment.RESOURCE_URL}search/resourceContent/${bi.id}`, {responseType: "text"}).subscribe({
      next: (contents: string) => {
        onContent(contents);
      }
    })

    this.client.get<ResourceMetadata>(`${environment.RESOURCE_URL}search/resourceMetaData/${bi.id}`).subscribe({
      next: (md: ResourceMetadata) => {
        onMetadata(md);
      }
    })
  }
}
