import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/attendanceOt";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class AttendanceOTService {

  constructor(private httpClient: HttpClient) {

  }

  searchAttendanceOt(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  createAttendanceOt(attendanceOt: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API,
      attendanceOt,
      {
        observe: 'response'
      }
    );
  }

  getAttendanceOtId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/detail" + '/' + id,
    );
  }

  editAttendanceOt(payload: any): Observable<any> {
    return this.httpClient.put(
      AUTH_API,
      payload,
    );
  }

  deleteAttendanceOt(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/delete" + '/' + id,
    );
  }

  exportAttendanceOt(payload : any, pageable: any) : Observable<any>{
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
