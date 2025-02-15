import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/qualification";
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

  search(userDetailId: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/search/" + userDetailId,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  create(qualification: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/create",
      qualification,
      {
        observe: 'response'
      }
    );
  }

  getId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/detail" + '/' + id,
    );
  }

  edit(payload: any): Observable<any> {
    return this.httpClient.put(
      AUTH_API,
      payload,
    );
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + '/' + id,
    );
  }

}
