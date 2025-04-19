import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/task";
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) {
  }

  search(employeeCode: any, projectId: any): Observable<any> {
    if (employeeCode != null && projectId != null) {
      return this.httpClient.post(API_CONFIG.BASE_URL + "task/list" + "?employeeCode=" + employeeCode + "&&projectId=" + projectId,
        null,
      )
    }
    return this.httpClient.post(API_CONFIG.BASE_URL + "task/search",
      null,
    )
  }

  getListForProject( projectId: any): Observable<any> {
      return this.httpClient.get(
        `${API_CONFIG.BASE_URL}project/detail/task/${projectId}`,
        )
  }

  getList(keyword: any,status : string, pageable: any): Observable<any> {
    let params = new HttpParams({fromObject: pageable});

    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}task/list/${status}`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: params
      }
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
