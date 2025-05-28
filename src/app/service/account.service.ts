import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {apiAccountManagement} from './api'

import {Observable} from "rxjs";
import {AccountSearchRequest} from "../pages/system/account-management/types/account";
import {API_CONFIG} from "../config/api-config";

const AUTH_API: string = "http://localhost:8080";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) {
  }

  getAllAccount(status: string, params: any): Observable<any> {
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}account/list/${status}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: params
      }
    );
  }

  getAllMenuItem(): Observable<any> {
    return this.httpClient.get(API_CONFIG.BASE_URL + "account/menu-item", httpOptions)
  }

  getRoleByRoleName(roleName: string): Observable<any> {
    return this.httpClient.get(API_CONFIG.BASE_URL +"account/role/" + roleName, httpOptions)
  }

  createAccount(payload: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + 'account/create-new-account',
      payload,
    );
  }

  updateRoleMenuItem(roleId: any, payload: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "account/update-role-menu-item/"  + roleId,
      payload,
    );
  }

  updateRole(data: { employeeCode: string; email: string; roleCodes: string[] }): Observable<any> {
    return this.httpClient.put(`${API_CONFIG.BASE_URL}account/update-role`, data);
  }

  lock(employeeCode: string): Observable<any> {
    return this.httpClient.put(
      `${API_CONFIG.BASE_URL}account/employee/lock?code=${employeeCode}`,
      null
    );
  }

  unlock(employeeCode: string): Observable<any> {
    return this.httpClient.put(
      `${API_CONFIG.BASE_URL}account/employee/unlock?code=${employeeCode}`,
      null
    );
  }


}
