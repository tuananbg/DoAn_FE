import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {LoginService} from "./login.service";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/attendance";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private httpClient: HttpClient,
              private login: LoginService) {
  }

  searchAttendance(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "attendance/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  createAttendance(attendance: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "attendance/create",
      attendance,
      {
        observe: 'response'
      }
    );
  }

  getAttendanceId(payload: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "attendance/detailAttendanceId",
      payload
    );
  }

  editAttendance(payload: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "attendance/update",
      payload,
    );
  }

  deleteAttendance(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "attendance/delete/" + id,
    );
  }

  exportAttendance(payload: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "attendance/exportListFollowMonth",
      payload,
      {
        responseType: 'blob',
        observe: 'response'
      }
    );
  }
}
