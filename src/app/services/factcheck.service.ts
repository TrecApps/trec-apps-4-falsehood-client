import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@tc/tc-ngx-general';
import ResponseObj from '../model/ResponseObj';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Factcheck } from '../model/Factcheck';

@Injectable({
  providedIn: 'root'
})
export class FactcheckService {

  constructor(private authService: AuthService, private client: HttpClient){

  } 


  getFactcheck(id: string): Observable<ResponseObj> {
    if(this.authService.hasActiveTokens()){
      return this.client.get<ResponseObj>(`${environment.FALSEHOOD_URL}/Factcheck/seekById/${id}`, {
        headers: this.authService.getHttpHeaders(false, false)
      });
    }

    return this.client.get<ResponseObj>(`${environment.FALSEHOOD_URL}/Factcheck/searchById/${id}`);
    
  }

  searchFactCheckByMode(mode: string, page:number, size:number): Observable<Factcheck[]>{
    let params = new HttpParams().append("page", page).append("size", size);
    return this.client.get<Factcheck[]>(`${environment.FALSEHOOD_URL}/Factcheck/${mode}`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    });
  }

  searchFactcheckByQuery(query: string, page:number, size: number): Observable<Factcheck[]> {
    let params = new HttpParams().append("page", page).append("size", size).append("q", query);
    return this.client.get<Factcheck[]>(`${environment.FALSEHOOD_URL}/Factcheck/search`, {
      params
    });
  }
}
