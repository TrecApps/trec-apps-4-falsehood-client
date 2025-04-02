import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@tc/tc-ngx-general';
import ResponseObj from '../model/ResponseObj';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Factcheck, FactcheckSubmission } from '../model/Factcheck';

@Injectable({
  providedIn: 'root'
})
export class FactcheckService {

  currentFactcheck: Factcheck | undefined;
  currentContents: string = "";


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


  // Write methods
  postFactcheck(submission: FactcheckSubmission, doSubmit: boolean): Observable<ResponseObj> {
    let params = new HttpParams().append("submit", doSubmit);
    return this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/Factcheck`, submission, {
      headers: this.authService.getHttpHeaders(true, true), params
    });
  }

  patchFactcheck(field: string, value: string, id: string): Observable<ResponseObj> {
    return this.client.patch<ResponseObj>(`${environment.FALSEHOOD_URL}/Factcheck/${id}`, {field, value}, {
      headers: this.authService.getHttpHeaders(true, true)
    });
  }

  submit(id:string): Observable<ResponseObj> {
    return this.client.put<ResponseObj>(`${environment.FALSEHOOD_URL}/Factcheck/submit/${id}`, null, {
      headers: this.authService.getHttpHeaders(false, false)
    })
  }

  reviewFactcheck(id:string, comment:string, action: string): Observable<ResponseObj> {
    return this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/Factcheck/review/${action}/${id}`, comment, {
      headers: this.authService.getHttpHeaders(false, false).append("Content-Type", "text/plain")
    })
  }

  appealFactcheck(id: string, comment: string): Observable<ResponseObj> {
    return this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/Factcheck/appeal/${id}`, comment, {
      headers: this.authService.getHttpHeaders(false, false).append("Content-Type", "text/plain")
    })
  }

  
}
