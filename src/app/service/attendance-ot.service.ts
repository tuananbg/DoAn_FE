import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/attendanceOt";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AttendanceOTService {

  constructor(private httpClient: HttpClient) {

  }

  searchAttendanceOt(status: string,params: any): Observable<any> {
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}attendance-ot/list/${status}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: params
      }
    );
  }

  createAttendanceOt(attendanceOt: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "attendance-ot/create",
      attendanceOt,
      {
        observe: 'response'
      }
    );
  }

  getAttendanceOtId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "attendanceOt/detail/" + id,
    );
  }

  editAttendanceOt(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "attendance-ot/update",
      payload,
    );
  }

  completeAttendanceOt(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "attendance-ot/complete",
      payload,
    );
  }

  deleteAttendanceOt(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "attendanceOt/delete/" + id,
    );
  }

  exportAttendanceOt(status: any): Observable<any> {
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}attendanceOt/download-xlsx/${status}`,
      {
        responseType: 'blob',
        observe: 'response'
      }
    );
  }
}
