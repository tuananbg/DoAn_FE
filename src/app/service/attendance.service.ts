import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {LoginService} from "./login.service";

const AUTH_API: string = "http://localhost:8080/api/v1/attendance";
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
      AUTH_API + "/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  createAttendance(attendance: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/create",
      attendance,
      {
        observe: 'response'
      }
    );
  }

  getAttendanceId(payload: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/detailAttendanceId",
      payload
    );
  }

  editAttendance(payload: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/update",
      payload,
    );
  }

  deleteAttendance(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/delete" + '/' + id,
    );
  }

  exportAttendance(payload : any) : Observable<any>{
    return this.httpClient.post(AUTH_API + "/exportListFollowMonth",
      payload,
      {
        responseType: 'blob',
        observe: 'response'
      }
    );
  }
}
