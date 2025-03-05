import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/timesheet";
@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {

  constructor(private httpClient: HttpClient) {
  }

  search(taskId: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "timesheet/search" + "?taskId=" + taskId,
      null,
    )
  }

  create(timeSheetDTO: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "timesheet/create",
      timeSheetDTO,
    );
  }

  deleteTimeSheet(id: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "timesheet/deleteTimeSheet/" + id,
      null,
    )
  }

}
