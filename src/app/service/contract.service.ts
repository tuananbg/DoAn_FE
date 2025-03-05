import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/contract";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ContractService {


  constructor(private httpClient: HttpClient) {
  }

  search(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "employee-contract/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  searchForEmployee(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "employee-contract/searchForEmployee",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  create(file: File, contractDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractCode', contractDTO.contractCode);
    formData.append('contractType', contractDTO.contractType);
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "employee-contract/create",
      formData,
      {
        observe: 'response'
      }
    );
  }

  createForEmployee(userDetailContractDTO: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "employee-contract/createForEmployee",
      userDetailContractDTO,
      {
        observe: 'response'
      })
  }

  getContractId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "employee-contract/detail/" + id,
    );
  }

  edit(file: File, contractDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractId', contractDTO.contractId);
    formData.append('contractCode', contractDTO.contractCode);
    formData.append('contractType', contractDTO.contractType);
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "employee-contract",
      formData,
      {
        observe: 'response'
      }
    );
  }

  editForEmployee(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "employee-contract/updateForEmployee",
      payload
    );
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "employee-contract/delete/" + id,
    );
  }

  deleteForEmployee(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "employee-contract/deleteForEmployee/" + id,
    );
  }

  downLoadFile(fileName: any): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    return this.httpClient.post(API_CONFIG.BASE_URL + "employee-contract/download", null, {
      responseType: 'blob',
      observe: 'response',
      params: params
    });
  }
}
