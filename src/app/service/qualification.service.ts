import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/qualification";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  token: BehaviorSubject<any> = new BehaviorSubject<any>('');
  header = ['Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiIiwic3ViIjoiaHF1YW5nYW5oMkBnbWFpbC5jb20iLCJpYXQiOjE3MDkzNzYzMjMsImV4cCI6MTcwOTQ2MjcyM30.olrDEr5ep7mXNPAYbBpchybsOIgqeIswTrX_W3evSsQ']

  constructor(private httpClient: HttpClient) {
    if (!localStorage.getItem('token')) {
      this.token.subscribe(val => {
        this.header = ['Authorization', 'Bearer ' + val];
      })
    } else {
      this.header = ['Authorization', 'Bearer ' + localStorage.getItem('token')]
    }
  }

  search(userDetailId: any): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "qualification/employee-detail/" + userDetailId,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
      }
    )
  }

  create(qualification: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "qualification/create",
      qualification,
      {
        observe: 'response'
      }
    );
  }

  getId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "qualification/detail/" + id,
    );
  }

  edit(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "qualification",
      payload,
    );
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "qualification/" + id,
    );
  }

}
