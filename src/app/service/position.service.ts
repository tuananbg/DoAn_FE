import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/position";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class PositionService {

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

  searchPosition(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  createPosition(position: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API,
      position,
      {
        observe: 'response'
      }
    );
  }

  getPositionId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/detail" + '/' + id,
    );
  }

  editPosition(payload: any): Observable<any> {
    return this.httpClient.put(
      AUTH_API,
      payload,
    );
  }

  deletePosition(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/delete" + '/' + id,
    );
  }

  exportPosition(payload : any, pageable: any) : Observable<any>{
    return this.httpClient.post(AUTH_API + "/export",
      pageable,
      {
        responseType: 'blob',
        observe: 'response',
        params: payload
      }
    );
  }
}
