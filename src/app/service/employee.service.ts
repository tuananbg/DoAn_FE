import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/employee";
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

  searchEmployee(keyword: any, pageable: any): Observable<any> {
    let params = new HttpParams({fromObject: pageable});

    if (keyword) {
      params = params.set('keyword', keyword); // Thêm keyword vào params
    }

    return this.httpClient.get(
      API_CONFIG.BASE_URL + "employee/list",
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: params,
      }
    )
  }

  getList(keyword: any,status : string, pageable: any): Observable<any> {
    let params = new HttpParams({ fromObject: pageable });

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}employee/list/${status}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: params
      }
    );
  }

  getListSelect(): Observable<any> {
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}employee/select`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  createEmployee(avatarFile: File, userDetailDTO: any): Observable<any> {
    const formData = new FormData();
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }
    formData.append("code", userDetailDTO.code);
    formData.append("fullName", userDetailDTO.fullName);
    formData.append("departmentCode", userDetailDTO.departmentCode);
    formData.append("positionCode", userDetailDTO.positionCode);
    formData.append("dateOfBirth", userDetailDTO.dateOfBirth);
    formData.append("gender", userDetailDTO.gender);
    const formattedDate = new Date(userDetailDTO.dateOfBirth).toISOString().split("T")[0];
    formData.append("dateOfBirth", formattedDate);
    formData.append("taxCode", userDetailDTO.taxCode);
    formData.append("insuranceNumber", userDetailDTO.insuranceNumber);
    formData.append("accountNumber", userDetailDTO.accountNumber);
    formData.append("permanentAddress", userDetailDTO.permanentAddress);
    formData.append("currentAddress", userDetailDTO.currentAddress);
    formData.append("identityNumber", userDetailDTO.identityNumber);
    formData.append("mobile", userDetailDTO.mobile);
    formData.append("nation", userDetailDTO.nation);
    console.log("data", formData)
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "employee/create",
      formData,
      {
        observe: 'response'
      }
    );
  }

  getEmployeeId(id: number): Observable<any> {
    return this.httpClient.get(API_CONFIG.BASE_URL + "employee/detail/" + id,);
  }

  getEmployeeCode(code: String): Observable<any> {
    return this.httpClient.get(API_CONFIG.BASE_URL + "employee/detail/" + code,);
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
      API_CONFIG.BASE_URL,
      formData,
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "employee/delete/" + id,
    );
  }

  exportEmployee(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "employee/export",
      pageable,
      {
        responseType: 'blob',
        observe: 'response',
        params: payload
      }
    );
  }

  exportPdf(): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "employee/export-pdf" + "/3",
      null,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        responseType: 'blob',
        observe: 'response',
      })
  }
}
