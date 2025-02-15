import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/wage";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class WageService {
  constructor(private httpClient: HttpClient) {
  }

  search(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  searchForEmployee(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/searchForEmployee",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  create(file: File, wageDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('wageName', wageDTO.wageName);
    formData.append('wageBase', wageDTO.wageBase);
    formData.append('wageDescription', wageDTO.wageDescription);
    return this.httpClient.post(
      AUTH_API + "/create",
      formData,
      {
        observe: 'response'
      }
    );
  }

  createForEmployee(userDetailContractDTO: any): Observable<any> {
    return this.httpClient.post(AUTH_API + "/createForEmployee",
      userDetailContractDTO,
      {
        observe: 'response'
      })
  }

  getContractId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/detail" + '/' + id,
    );
  }

  edit(file: File, wageDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('wageId', wageDTO.wageId);
    formData.append('wageName', wageDTO.wageName);
    formData.append('wageBase', wageDTO.wageBase);
    formData.append('wageDescription', wageDTO.wageDescription);
    return this.httpClient.put(
      AUTH_API,
      formData,
      {
        observe: 'response'
      }
    );
  }

  editForEmployee(payload: any): Observable<any> {
    return this.httpClient.put(
      AUTH_API+ "/updateForEmployee",
      payload
    );
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/delete" + '/' + id,
    );
  }

  deleteForEmployee(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/deleteForEmployee" + '/' + id,
    );
  }

  downLoadFile(fileName: any): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    return this.httpClient.post(AUTH_API + "/download", null, {
      responseType: 'blob',
      observe: 'response',
      params: params
    });
  }
}
