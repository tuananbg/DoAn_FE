import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
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

  searchAttendanceLeave(keyword: any,status : string, pageable: any): Observable<any> {
    let params = new HttpParams({fromObject: pageable});
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}attendance-leave/list/${status}`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: params
      }
    )
  }

  createAttendanceLeave(attendanceLeave: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "attendance-leave/create",
      attendanceLeave,
      {
        observe: 'response'
      }
    );
  }

  getAttendanceLeaveId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "attendance-leave/detail" + '/' + id,
    );
  }

  editAttendanceLeave(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "attendance-leave/update",
      payload,
    );
  }

  completeAttendanceLeave(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "attendance-leave/complete",
      payload,
    );
  }

  deleteAttendanceLeave(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "attendance-leave/delete" + '/' + id,
    );
  }

  exportAttendanceLeave(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "attendance-leave/export",
      pageable,
      {
        responseType: 'blob',
        observe: 'response',
        params: payload
      }
    );
  }
}
