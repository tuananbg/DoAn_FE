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

  getAllRole(): Observable<any> {
    return this.httpClient.get(AUTH_API + apiAccountManagement.apiGetRoles, httpOptions)
  }

  getRole(id: any): Observable<any> {
    return this.httpClient.get(
      AUTH_API + apiAccountManagement.apiGetRolesDetail + "/" + id,
    );
  }

  getAllMenuItem(): Observable<any> {
    return this.httpClient.get(AUTH_API + apiAccountManagement.apiGetMenuItem, httpOptions)
  }

  getRoleByRoleName(roleName: string): Observable<any> {
    return this.httpClient.get(AUTH_API + apiAccountManagement.apiGetRoleByRoleName + roleName, httpOptions)
  }

  createAccount(payload: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + '/api/v1/account/create-new-account',
      payload,
    );
  }

  updateRoleMenuItem(roleId: any, payload: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + apiAccountManagement.apiUpdateRoleMenuItem + "/" + roleId,
      payload,
    );
  }

  updateRole(email: any, roleNames: string[]): Observable<any> {
    return this.httpClient.put(
      AUTH_API + apiAccountManagement.apiUpdateRole + "/" + email,
      roleNames,
    )
  }


}
