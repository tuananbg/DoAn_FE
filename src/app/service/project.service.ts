import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
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

  create(avatarFile: File, projectDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('avatarFile', avatarFile);
    formData.append('projectCode', projectDTO.projectCode);
    formData.append('projectName', projectDTO.projectName);
    formData.append('projectDescription', projectDTO.projectDescription);
    formData.append('projectManagerId', projectDTO.projectManagerId);
    formData.append('startDay', projectDTO.startDay);
    formData.append('endDay', projectDTO.endDay);
    formData.append('customerName', projectDTO.customerName);
    formData.append('employees', projectDTO.employees);
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

  editProject(avatarFile: File, projectDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('id', projectDTO.id);
    formData.append('avatarFile', avatarFile);
    formData.append('projectCode', projectDTO.projectCode);
    formData.append('projectName', projectDTO.projectName);
    formData.append('projectDescription', projectDTO.projectDescription);
    formData.append('projectManagerId', projectDTO.projectManagerId);
    formData.append('startDay', projectDTO.startDay);
    formData.append('endDay', projectDTO.endDay);
    formData.append('customerName', projectDTO.customerName);
    formData.append('employees', projectDTO.employees);
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "project",
      formData,
    );
  }

}
