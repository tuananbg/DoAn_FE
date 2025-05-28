import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiAuth} from "./api";
import {Router} from "@angular/router";
import {API_CONFIG} from "../config/api-config";


const AUTH_API: string = "http://localhost:8080";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  loginAccount(payload: any): Observable<any> {
    return this.http.post(API_CONFIG.BASE_URL + "auth/login", payload);
  }

  verifyForm(code: string): Observable<any> {
    return this.http.get(API_CONFIG.BASE_URL + `auth/check-verify-code/${code}`)
  }

  registerAccount(payload: any): Observable<any> {
    return this.http.post(API_CONFIG.BASE_URL + "auth/register", payload);
  }

  sendOTP(account: string): Observable<any> {
    return this.http.post(API_CONFIG.BASE_URL + `auth/resend-code/${account}`,null)
  }

  forgotPassword(payload: any): Observable<any> {
    return this.http.post(API_CONFIG.BASE_URL + 'auth/forgot-password', payload);
  }
  changePassword(payload: any): Observable<any> {
    return this.http.post(API_CONFIG.BASE_URL + 'auth/change-password', payload);
  }

}
