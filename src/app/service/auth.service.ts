import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiAuth} from "./api";
import {Router} from "@angular/router";


const AUTH_API:string = "http://localhost:8080";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginAccount(payload: any): Observable<any> {
    return this.http.post(AUTH_API + apiAuth.apiLogin, payload);
  }

  registerAccount(payload: any): Observable<any> {
    return this.http.post(AUTH_API + apiAuth.apiRegister, payload);
  }
}
