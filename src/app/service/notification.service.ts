import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // private apiUrl = 'http://localhost:8080/api/v1/notifications';

  constructor(private http: HttpClient) {
  }

  getTodayBirthdayEmployees(): Observable<any> {
    return this.http.get(API_CONFIG.BASE_URL + `notifications/birthdays`);
  }

  getEmployeesWithBirthdaysInCurrentMonth(): Observable<any> {
    return this.http.get(API_CONFIG.BASE_URL + `notifications/birthdays/month`);
  }

}
