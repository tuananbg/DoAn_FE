import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/task";
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) {
  }

  search(userDetailId: any, projectId: any): Observable<any>{
    if(userDetailId!=null && projectId != null){
      return this.httpClient.post(AUTH_API+ "/search" +"?userDetailId="+userDetailId+"&&projectId="+projectId,
        null,
      )
    }
    return this.httpClient.post(AUTH_API+ "/search",
      null,
    )
  }

  create(taskDTO: any): Observable<any> {
    return this.httpClient.post(
        AUTH_API+ "/create",
      taskDTO,
    );
  }

  getTaskId(id: number): Observable<any> {
    return this.httpClient.get(
        AUTH_API + "/detail" + '/' + id,
    );
  }

  edit(taskDTO: any): Observable<any> {
    return this.httpClient.put(
        AUTH_API,
      taskDTO,
    );
  }

  updateStatus(id: any, taskStatus: any): Observable<any>{
    return this.httpClient.post(AUTH_API+"/updateTaskStatus/"+id+"?taskStatus="+taskStatus,
      null,
      )
  }

}
