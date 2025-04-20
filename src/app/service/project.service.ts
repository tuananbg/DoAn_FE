import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/project";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  search(userDetailId: any): Observable<any> {
    if (userDetailId != null) {
      return this.httpClient.post(API_CONFIG.BASE_URL + "project/search" + "?userDetailId=" + userDetailId,
        null,
      )
    }
    return this.httpClient.post(API_CONFIG.BASE_URL + "project/search",
      null,
    )
  }

  getList(): Observable<any> {
    // let params = new HttpParams({fromObject: pageable});
    //
    // if (keyword) {
    //   params = params.set('keyword', keyword);
    // }

    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}project/list`,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        // params: params
      }
    )
  }

  create( projectDTO: any): Observable<any> {
    const formData = new FormData();
    // formData.append('avatarFile', avatarFile);
    formData.append('projectCode', projectDTO.projectCode);
    formData.append('projectName', projectDTO.projectName);
    formData.append('projectDescription', projectDTO.projectDescription);
    formData.append('projectManagerCode', projectDTO.projectManagerCode);
    formData.append('startDay', projectDTO.startDay);
    formData.append('endDay', projectDTO.endDay);
    formData.append('clientName', projectDTO.clientName);
    formData.append('status', projectDTO.status);
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "project/create",
      formData,
    );
  }

  getProjectId(id: number): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "project/detail/" + id,
    );
  }

  getListSelect(): Observable<any> {
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}project/select`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  editProject( projectDTO: any): Observable<any> {
    // const formData = new FormData();
    // formData.append('projectCode', projectDTO.projectCode);
    // formData.append('projectName', projectDTO.projectName);
    // formData.append('projectDescription', projectDTO.projectDescription);
    // formData.append('projectManagerCode', projectDTO.projectManagerCode);
    // formData.append('startDay', projectDTO.startDay);
    // formData.append('endDay', projectDTO.endDay);
    // formData.append('clientName', projectDTO.clientName);
    // formData.append('status', projectDTO.status);
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "project/update",
      projectDTO,
    );
  }

}
