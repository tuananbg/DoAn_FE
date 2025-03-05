import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/task";
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) {
  }

  search(userDetailId: any, projectId: any): Observable<any> {
    if (userDetailId != null && projectId != null) {
      return this.httpClient.post(API_CONFIG.BASE_URL + "task/search" + "?userDetailId=" + userDetailId + "&&projectId=" + projectId,
        null,
      )
    }
    return this.httpClient.post(API_CONFIG.BASE_URL + "task/search",
      null,
    )
  }

  create(taskDTO: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "task/create",
      taskDTO,
    );
  }

  getTaskId(id: number): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "task/detail/" + id,
    );
  }

  edit(taskDTO: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "task",
      taskDTO,
    );
  }

  updateStatus(id: any, taskStatus: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "task/updateTaskStatus/" + id + "?taskStatus=" + taskStatus,
      null,
    )
  }

}
