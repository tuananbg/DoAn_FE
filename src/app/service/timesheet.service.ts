import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/timesheet";
@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {

  constructor(private httpClient: HttpClient) {
  }

  search(taskId: any): Observable<any>{
      return this.httpClient.post(AUTH_API+ "/search" +"?taskId="+taskId,
        null,
      )
  }

  create(timeSheetDTO: any): Observable<any> {
    return this.httpClient.post(
        AUTH_API+ "/create",
      timeSheetDTO,
    );
  }

  deleteTimeSheet(id: any): Observable<any>{
    return this.httpClient.post(AUTH_API+"/deleteTimeSheet/"+id,
      null,
      )
  }

}
