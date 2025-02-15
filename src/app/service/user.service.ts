import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { apiUserManagement } from './api'
import {UserSearchRequest} from "../pages/HRM/user-managerment/types/userSearch";
import {Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080";
// const token: string = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoie1widXNlck5hbWVcIjpcImFkbWluQGFkbWluLmNvbVwiLFwiZW1haWxcIjpcImFkbWluQGFkbWluLmNvbVwiLFwiY29tcGFueUlkXCI6MixcImNvbXBhbnlOYW1lXCI6XCJzZnNhZmRzZmRzZlwiLFwicm9sZXNcIjpbe1wiaWRcIjoxLFwicm9sZU5hbWVcIjpcIkFETUlOXCJ9XX0iLCJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE3MDY1NDEwOTQsImV4cCI6MTcwNjYyNzQ5NH0.2VFEMCRs8kjDKjo7Evx6dG-RIw8Q2tnzpdef6gJa3Z8"
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUser(userSearch: UserSearchRequest, page: number, size: number):Observable<any>{
    return this.http.post(AUTH_API + apiUserManagement.apiSearchUser +`?page=${page}&size=${size}`, userSearch, httpOptions)
  }
}
