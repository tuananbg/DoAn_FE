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
      API_CONFIG.BASE_URL + "allowance/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  getList(keyword: any,status: string, params: any): Observable<any> {
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}allowance/list/${status}`,
      { params }
    );
  }


  searchForEmployee(employeeCode: any,pageable: any): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "allowance/employee-detail/" + employeeCode,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  create(file: File, wageDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('allowanceCode', wageDTO.allowanceCode);
    formData.append('allowanceName', wageDTO.allowanceName);
    formData.append('allowanceBase', wageDTO.allowanceBase);
    formData.append('allowanceDescription', wageDTO.allowanceDescription);
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "allowance/create",
      formData,
      {
        observe: 'response'
      }
    );
  }

  createForEmployee(userDetailContractDTO: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "allowance/createForEmployee",
      userDetailContractDTO,
      {
        observe: 'response'
      })
  }

  getContractId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "allowance/detail/" + id,
    );
  }

  edit(file: File, wageDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('wageId', wageDTO.wageId);
    formData.append('allowanceCode', wageDTO.allowanceCode);
    formData.append('allowanceName', wageDTO.allowanceName);
    formData.append('allowanceBase', wageDTO.allowanceBase);
    formData.append('allowanceDescription', wageDTO.allowanceDescription);
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "allowance/update",
      formData,
      {
        observe: 'response'
      }
    );
  }

  editForEmployee(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "allowance/updateForEmployee",
      payload
    );
  }

  lockAllowance(allowanceCode: string): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "allowance/lock/" + allowanceCode,null
    );
  }

  deleteForEmployee(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "allowance/deleteForEmployee/" + id,
    );
  }

  downLoadFile(fileName: any): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    return this.httpClient.post(API_CONFIG.BASE_URL + "allowance/download", null, {
      responseType: 'blob',
      observe: 'response',
      params: params
    });
  }
}
