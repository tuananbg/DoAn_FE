import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/leave";
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
      API_CONFIG.BASE_URL + "leave/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  createAttendanceLeave(attendanceLeave: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "leave",
      attendanceLeave,
      {
        observe: 'response'
      }
    );
  }

  getAttendanceLeaveId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "leave/detail" + '/' + id,
    );
  }

  editAttendanceLeave(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "leave",
      payload,
    );
  }

  deleteAttendanceLeave(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "leave/delete" + '/' + id,
    );
  }

  exportAttendanceLeave(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "leave/export",
      pageable,
      {
        responseType: 'blob',
        observe: 'response',
        params: payload
      }
    );
  }
}
