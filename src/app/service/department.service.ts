import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {LoginService} from "./login.service";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/department";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private httpClient: HttpClient,
              private login: LoginService) {
  }

  searchDepartment(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "department/getAllPage",
      payload,
      {
        params: pageable,
      }
    )
  }

  getList(keyword: string | null, status: string, params: any): Observable<any> {
    if (keyword) {
      params = {
        ...params,
        keyword: keyword
      };
    }

    return this.httpClient.get(`${API_CONFIG.BASE_URL}department/list/${status}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params
    });
  }


  getListDepartment(pageable: any): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "department/list",
    )
  }

  createDepartment(department: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "department/create",
      department,
      {
        observe: 'response'
      }
    );
  }

  getDepartmentById(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "department/detail/" + id,
    );
  }

  editDepartment(payload: any, id: number): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "department/update/" + id,
      payload,
    );
  }

  lock(departmentCode: string): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "department/lock/" + departmentCode,null
    );
  }

  unlock(departmentCode: string): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "department/unlock/" + departmentCode,null
    );
  }

  exportEmployee(status: string): Observable<any> {
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}employee-contract/download-xlsx/${status}`,  // <-- thêm status vào URL
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
}
