import { HttpClient, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, HttpContentType } from '@tc/tc-ngx-general';
import { FalsehoodFull, FalsehoodRet, FalsehoodSubmission } from '../model/Falsehood';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import ResponseObj from '../model/ResponseObj';
import { BriefPurpose } from '../model/Brief';
import { FalsehoodStage } from '../model/Factcheck';
import { Record, RecordEvent } from '../model/Record';

@Injectable({
  providedIn: 'root'
})
export class FalsehoodService {

  falsehoodList: FalsehoodFull[] = [];

  currentFalsehood: FalsehoodFull | undefined;

  constructor(private authService: AuthService, private client: HttpClient) { 

  }

  searchByFields(mode:string, before: Date | undefined, after: Date | undefined, page: number, size: number): Observable<FalsehoodRet[]> {

    let params = new HttpParams()
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
        headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
        params
      })
    }
    return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/public/search/${mode}`, {
      headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
      params
    })

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
        headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
        params
      })
    }
    return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/public/search/${mode}`, {
      headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
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
        headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
        params
      })
    }
    return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/public/search/${mode}`, {
      headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
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
        headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
        params
      })
    }
    return this.client.get<FalsehoodRet[]>(`${environment.FALSEHOOD_URL}/Falsehoods/public/search/${mode}`, {
      headers: this.authService.getHttpHeaders2(HttpContentType.NONE),
      params
    })

  }

  searchFalsehood(id: string, onSet?: Function): Observable<FalsehoodFull> {
    let ret: Observable<FalsehoodFull>;
    if(this.authService.hasActiveTokens()){
      ret = this.client.get<FalsehoodFull>(`${environment.FALSEHOOD_URL}/Falsehoods/${id}`, {
        headers: this.authService.getHttpHeaders2(HttpContentType.NONE)
      })
    } else {
      ret = this.client.get<FalsehoodFull>(`${environment.FALSEHOOD_URL}/Falsehoods/public/${id}`, {
        headers: this.authService.getHttpHeaders2(HttpContentType.NONE)
      })
    }

    ret.subscribe({
      next: (value: FalsehoodFull) => {
        this.currentFalsehood = value;
        this.falsehoodList.push(value);
        if(onSet){
          onSet();
        }
      }
    })

    return ret;
  }


  runPatch( field: string, value:string | undefined, onUpdated?: Function){
    if(!this.currentFalsehood?.fullMetaData?.id) return;
    this.client.patch<ResponseObj>(`${environment.FALSEHOOD_URL}/Falsehood/${this.currentFalsehood.fullMetaData.id}`, {
      field, value
    }, {headers: this.authService.getHttpHeaders2(HttpContentType.JSON)}).subscribe({
      next: (value: ResponseObj) => {
        if(onUpdated){
          onUpdated(true);
        }
      }, error: () => {
        if(onUpdated){
          onUpdated(false);
        }
      }
    });
  }

  // Briefs
  submitBrief(falsehoodId: string, type: BriefPurpose, content: string): Observable<ResponseObj> {
    return this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/Brief/${falsehoodId}`, {
      type, content
    },{headers: this.authService.getHttpHeaders2(HttpContentType.JSON)});
  }

  editBrief(falsehoodId: string, id: string, content:string): Observable<ResponseObj> {
     return this.client.put<ResponseObj>(`${environment.FALSEHOOD_URL}/Brief/${falsehoodId}`, content, {
      headers: this.authService.getHttpHeaders2(HttpContentType.PLAIN_TEXT),
     })
  }

  // Reviews
  canReview(): boolean {
    if(!this.currentFalsehood?.fullMetaData || !this.authService.hasActiveTokens() || !this.authService.tcUser) return false;
    let user = this.authService.tcUser;
    let status = this.currentFalsehood.fullMetaData.status;
    if(status == FalsehoodStage.SUBMITTED || status.toString() == "SUBMITTED") {
      return (user.credibilityRating && user.credibilityRating >= 45) || user.authRoles.includes("EMPLOYEE_AUTH");
    }
    if(status == FalsehoodStage.ACCEPTED || status.toString() == "ACCEPTED") {
      return user.authRoles.includes("EMPLOYEE_AUTH") || user.authRoles.includes("FALSEHOOD_JUR");
    }
    if(status == FalsehoodStage.R_APPEALED || status == FalsehoodStage.S_APPEALED
       || status.toString() == "R_APPEALED"  || status.toString() == "S_APPEALED"
    ){
      return user.authRoles.includes("EMPLOYEE_AUTH")
    }
    return false;
  }

  getReviewOptions(): string[] {
    if(!this.currentFalsehood?.fullMetaData) return [];
    let status = this.currentFalsehood.fullMetaData.status;
    switch(status.toString()){
      case FalsehoodStage.ACCEPTED.toString(): // second Review
      case "ACCEPTED":
      case FalsehoodStage.S_APPEALED.toString():
      case "S_APPEALED":
        return ["confirm", "deny"]
      case FalsehoodStage.SUBMITTED.toString():
      case FalsehoodStage.R_APPEALED.toString():
      case "SUBMITTED":
      case "R_APPEALED":
        return ["approve","reject","penalize","suggest"]
      default: return []
    }
  }

  getRecordType(action:string): RecordEvent {
    switch(action){
      case "confirm": return RecordEvent.CONFIRM;
      case "deny": return RecordEvent.DENY;
      case "approve": return RecordEvent.ACCEPT;
      case "reject": return RecordEvent.REJECT;
      case "penalize": return RecordEvent.PENALIZE;
      case "suggest": return RecordEvent.SUGGEST;
      case "appeal1": return RecordEvent.APPEAL_1;
      case "appeal2": return RecordEvent.APPEAL_2;
    }

    return RecordEvent.EDITED;
  }

  submitReview(comment: string, action: string, points: number, onAdded?: Function) {
    let id = this.currentFalsehood?.fullMetaData?.id;
    if(!id) return;
    let ret: Observable<ResponseObj>;

    if(action == "confirm" || action == "deny") {
      ret = this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/Review2/verdict/${action}`, {
        falsehoodId: id,
        comment,
        denyPoints: points
      }, { headers: this.authService.getHttpHeaders2(HttpContentType.JSON)});
    } else {
      ret = this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/FalsehoodReview/${action}/${id}`, comment, {
        headers: this.authService.getHttpHeaders2(HttpContentType.PLAIN_TEXT)
      })
    }

    ret.subscribe({
      next: (value: ResponseObj) => {
        let record: Record = {
          id: value.id || '',
          falsehoodId: id,
          userId: '',
          brandId: undefined,
          displayName: this.authService.getCurrentDisplayName()?.toString() || '',
          date: new Date(),
          event: this.getRecordType(action),
          comment: comment,
          points: points
        }

        this.currentFalsehood?.fullMetaData?.records.push(record);

        if(onAdded) onAdded();
      }
    })
  } 

  canAppeal(): boolean {
    if(!this.currentFalsehood?.fullMetaData || !this.authService.hasActiveTokens() || !this.authService.tcUser) return false;
    let user = this.authService.tcUser;
    let meta = this.currentFalsehood.fullMetaData;
    let status = meta.status;

    if(status == FalsehoodStage.REJECTED || status.toString() == "REJECTED"){
      return this.currentFalsehood.fullMetaData.userId == user.id;
    }

    if(status == FalsehoodStage.CONFIRMED || status == FalsehoodStage.DENIED ||
      status.toString() == "CONFIRMED" || status.toString() == "DENIED"
    ) {

      let brand = this.authService.tcBrand?.infoId;
      if(brand && (brand == meta.publicFigure?.brandId || brand == meta.mediaOutlet?.brandId ||brand == meta.institution?.brandId ))
        return true;

      return this.currentFalsehood.fullMetaData.userId == user.id ||
            user.authRoles.includes("FALSEHOOD_JUR") ||
            user.authRoles.includes("EMPLOYEE_AUTH");
    }

    return false;
  }

  submitAppeal(comment: string, onAppealed?: Function) {
    if(!this.currentFalsehood?.fullMetaData || !this.authService.hasActiveTokens() || !this.authService.tcUser) return;
    let meta = this.currentFalsehood.fullMetaData;
    let status = meta.status;
    let id = meta.id;


    let ret: Observable<ResponseObj>;

    let action = "";

    if(status == FalsehoodStage.REJECTED || status.toString() == "REJECTED"){
      ret = this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/FalsehoodReview/appeal/${id}`, comment, {
        headers: this.authService.getHttpHeaders2(HttpContentType.PLAIN_TEXT)
      })
      action = "appeal1";
    } else {
      ret = this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/Review2/appeal/${id}`, comment, {
        headers: this.authService.getHttpHeaders2(HttpContentType.PLAIN_TEXT)
      })
      action = "appeal2";
    }


    ret.subscribe({
      next: (value: ResponseObj) => {
        let record: Record = {
          id: value.id || '',
          falsehoodId: id,
          userId: '',
          brandId: undefined,
          displayName: this.authService.getCurrentDisplayName()?.toString() || '',
          date: new Date(),
          event: this.getRecordType(action),
          comment: comment,
          points: 0
        }

        this.currentFalsehood?.fullMetaData?.records.push(record);
        meta.status = action == "appeal1" ? FalsehoodStage.R_APPEALED : FalsehoodStage.S_APPEALED;

        if(onAppealed) onAppealed();
      }
    })
  }


  submitFalsehood(newFalsehood: FalsehoodSubmission, doSubmit: boolean): Observable<ResponseObj>{
    
    let params = new HttpParams().append("doSubmit", doSubmit);
    
    return this.client.post<ResponseObj>(`${environment.FALSEHOOD_URL}/Falsehood`, newFalsehood, {
      headers: this.authService.getHttpHeaders2(HttpContentType.JSON),
      params
    });
  }

  submitSavedFalsehood(id: string) : Observable<ResponseObj> {

    return this.client.get<ResponseObj>(`${environment.FALSEHOOD_URL}/Falsehood/submit/${id}`, {
      headers: this.authService.getHttpHeaders2(HttpContentType.NONE)
    });
  }
}
