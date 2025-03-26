import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@tc/tc-ngx-general';
import { FalsehoodFull, FalsehoodRet } from '../model/Falsehood';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FalsehoodService {

  falsehoodList: FalsehoodFull[] = [];

  currentFalsehood: FalsehoodFull | undefined;

  constructor(private authService: AuthService, private client: HttpClient) { 

  }

  searchByPublicFigure(mode:string, pfId: string, before: Date | undefined, after: Date | undefined, page: number, size: number): Observable<FalsehoodRet[]> {

    let params = new HttpParams()
      .append("pf", pfId)
      .append("page", page)
      .append("size", size);

    if(before){
      params = params.append("bf", before.toUTCString());
    }
    if(after) {
      params = params.append("af", after.toUTCString());
    }

    if(this.authService.hasActiveTokens()){
      return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/search/${mode}`, {
        headers: this.authService.getHttpHeaders(false, false),
        params
      })
    }
    return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/public/search/${mode}`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    })

  }

  searchByMediaOutlet(mode:string, moId: string, before: Date | undefined, after: Date | undefined, page: number, size: number): Observable<FalsehoodRet[]> {

    let params = new HttpParams()
      .append("mo", moId)
      .append("page", page)
      .append("size", size);

    if(before){
      params = params.append("bf", before.toUTCString());
    }
    if(after) {
      params = params.append("af", after.toUTCString());
    }

    if(this.authService.hasActiveTokens()){
      return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/search/${mode}`, {
        headers: this.authService.getHttpHeaders(false, false),
        params
      })
    }
    return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/public/search/${mode}`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    })

  }

  searchByInstitution(mode:string, inId: string, before: Date | undefined, after: Date | undefined, page: number, size: number): Observable<FalsehoodRet[]> {

    let params = new HttpParams()
      .append("in", inId)
      .append("page", page)
      .append("size", size);

    if(before){
      params = params.append("bf", before.toUTCString());
    }
    if(after) {
      params = params.append("af", after.toUTCString());
    }

    if(this.authService.hasActiveTokens()){
      return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/search/${mode}`, {
        headers: this.authService.getHttpHeaders(false, false),
        params
      })
    }
    return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/public/search/${mode}`, {
      headers: this.authService.getHttpHeaders(false, false),
      params
    })

  }

  searchFalsehood(id: string): Observable<FalsehoodFull> {
    let ret: Observable<FalsehoodFull>;
    if(this.authService.hasActiveTokens()){
      ret = this.client.get<FalsehoodFull>(`${environment.FALSEHOOD_URL}/Falsehoods/{id}`, {
        headers: this.authService.getHttpHeaders(false, false)
      })
    } else {
      ret = this.client.get<FalsehoodFull>(`${environment.FALSEHOOD_URL}/Falsehoods/public/{id}`, {
        headers: this.authService.getHttpHeaders(false, false)
      })
    }

    ret.subscribe({
      next: (value: FalsehoodFull) => {
        this.currentFalsehood = value;
        this.falsehoodList.push(value);
      }
    })

    return ret;
  }
}
