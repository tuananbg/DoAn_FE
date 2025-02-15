import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/employee";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  token: BehaviorSubject<any> = new BehaviorSubject<any>('');
  header = ['Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiIiwic3ViIjoiaHF1YW5nYW5oMkBnbWFpbC5jb20iLCJpYXQiOjE3MDkzNzYzMjMsImV4cCI6MTcwOTQ2MjcyM30.olrDEr5ep7mXNPAYbBpchybsOIgqeIswTrX_W3evSsQ']

  constructor(private httpClient: HttpClient) {
    if (!localStorage.getItem('token')) {
      this.token.subscribe(val => {
        this.header = ['Authorization', 'Bearer ' + val];
      })
    } else {
      this.header = ['Authorization', 'Bearer ' + localStorage.getItem('token')]
    }
  }

  searchEmployee(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
        AUTH_API + "/search",
        payload,
        {
          headers: new HttpHeaders({'Content-Type': 'application/json'}),
          params: pageable,
        }
    )
  }

  createEmployee(avatarFile: File, userDetailDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('avatarFile', avatarFile);
    formData.append('employeeCode', userDetailDTO.employeeCode);
    formData.append('employeeName', userDetailDTO.employeeName);
    formData.append('gender', userDetailDTO.gender);
    formData.append('phone', userDetailDTO.phone);
    formData.append('email', userDetailDTO.email);
    formData.append('birthday', userDetailDTO.birthday);
    formData.append('address', userDetailDTO.address);
    formData.append('departmentId', userDetailDTO.departmentId);
    formData.append('positionId', userDetailDTO.positionId);
    return this.httpClient.post(
        AUTH_API+ "/create",
        formData,
        {
          observe: 'response'
        }
    );
  }

  getEmployeeId(id: number): Observable<any> {
    return this.httpClient.get(
        AUTH_API + "/detail" + '/' + id,
    );
  }

  editEmployee(avatarFile: File, userDetailDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('id', userDetailDTO.id);
    formData.append('avatarFile', avatarFile);
    formData.append('employeeCode', userDetailDTO.employeeCode);
    formData.append('employeeName', userDetailDTO.employeeName);
    formData.append('gender', userDetailDTO.gender);
    formData.append('phone', userDetailDTO.phone);
    formData.append('birthday', userDetailDTO.birthday);
    formData.append('address', userDetailDTO.address);
    formData.append('departmentId', userDetailDTO.departmentId);
    formData.append('positionId', userDetailDTO.positionId);
    return this.httpClient.put(
        AUTH_API,
        formData,
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.httpClient.delete(
        AUTH_API + "/delete" + '/' + id,
    );
  }

  exportEmployee(payload : any, pageable: any) : Observable<any>{
    return this.httpClient.post(AUTH_API + "/export",
        pageable,
        {
          responseType: 'blob',
          observe: 'response',
          params: payload
        }
    );
  }

  exportPdf() : Observable<any>{
    return this.httpClient.post(AUTH_API + "/export-pdf" +"/3",
      null,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        responseType: 'blob',
        observe: 'response',
      })
  }
}
