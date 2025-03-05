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

  deleteDepartment(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "department/delete/" + id,
    );
  }
}
