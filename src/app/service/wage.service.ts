import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/wage";
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
      API_CONFIG.BASE_URL + "wage/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  searchForEmployee(id: any): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "wage/employee-detail/" + id,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
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
      API_CONFIG.BASE_URL + "wage/create",
      formData,
      {
        observe: 'response'
      }
    );
  }

  createForEmployee(userDetailContractDTO: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "wage/createForEmployee",
      userDetailContractDTO,
      {
        observe: 'response'
      })
  }

  getContractId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "wage/detail/" + id,
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
      API_CONFIG.BASE_URL + "wage",
      formData,
      {
        observe: 'response'
      }
    );
  }

  editForEmployee(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "wage/updateForEmployee",
      payload
    );
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "wage/delete/" + id,
    );
  }

  deleteForEmployee(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "wage/deleteForEmployee/" + id,
    );
  }

  downLoadFile(fileName: any): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    return this.httpClient.post(API_CONFIG.BASE_URL + "wage/download", null, {
      responseType: 'blob',
      observe: 'response',
      params: params
    });
  }
}
