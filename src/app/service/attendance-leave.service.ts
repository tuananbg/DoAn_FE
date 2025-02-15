import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/leave";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class AttendanceLeaveService {

  constructor(private httpClient: HttpClient) {

  }

  searchAttendanceLeave(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  createAttendanceLeave(attendanceLeave: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API,
      attendanceLeave,
      {
        observe: 'response'
      }
    );
  }

  getAttendanceLeaveId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/detail" + '/' + id,
    );
  }

  editAttendanceLeave(payload: any): Observable<any> {
    return this.httpClient.put(
      AUTH_API,
      payload,
    );
  }

  deleteAttendanceLeave(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/delete" + '/' + id,
    );
  }

  exportAttendanceLeave(payload : any, pageable: any) : Observable<any>{
    return this.httpClient.post(AUTH_API + "/export",
      pageable,
      {
        responseType: 'blob',
        observe: 'response',
        params: payload
      }
    );
  }
}
