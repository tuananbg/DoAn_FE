import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { apiAccountManagement } from './api'

import {Observable} from "rxjs";
import {AccountSearchRequest} from "../pages/system/account-management/types/account";
const AUTH_API: string = "http://localhost:8080";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getAllAccount(searchData: object, page: number, size: number):Observable<any>{
    return this.http.post(AUTH_API + apiAccountManagement.apiGetAccount +`?page=${page}&size=${size}`,searchData, httpOptions)
  }

  getAllRole():Observable<any>{
    return this.http.get(AUTH_API + apiAccountManagement.apiGetRoles, httpOptions)
  }

  getAllMenuItem():Observable<any>{
    return this.http.get(AUTH_API + apiAccountManagement.apiGetMenuItem, httpOptions)
  }

  getRoleByRoleName(roleName: string):Observable<any>{
    return this.http.get(AUTH_API + apiAccountManagement.apiGetRoleByRoleName + roleName, httpOptions)
  }

  editAccount(payload: any): Observable<any> {
    return this.http.put(
      AUTH_API + '/api/v1/account',
      payload,
    );
  }

  updateRoleMenuItem(roleId: any, payload: any): Observable<any> {
    return this.http.post(
      AUTH_API + apiAccountManagement.apiUpdateRoleMenuItem + "/"+roleId,
      payload,
    );
  }

  updateRole(email: any, roleNames: string[]): Observable<any>{
    return this.http.put(
      AUTH_API + apiAccountManagement.apiUpdateRole + "/"+email,
      roleNames,
    )
  }


}
