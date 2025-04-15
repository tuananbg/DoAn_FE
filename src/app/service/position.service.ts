import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

// const AUTH_API: string = "http://localhost:8080/api/v1/position";
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

  getList(status: string, params: any): Observable<any> {
    const cleanParams: any = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    });

    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}position/list/${status}`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: cleanParams
      }
    );
  }



  createPosition(position: any): Observable<any> {
    return this.httpClient.post(
      API_CONFIG.BASE_URL + "position/create",
      position,
      {
        observe: 'response'
      }
    );
  }

  getPositionId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "position/detail/" + id,
    );
  }

  getSelection(): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "position/list/selection" ,
    )
  }

  editPosition(payload: any): Observable<any> {
    return this.httpClient.put(
      API_CONFIG.BASE_URL + "position",
      payload,
    );
  }

  deletePosition(id: string): Observable<any> {
    return this.httpClient.delete(
      API_CONFIG.BASE_URL + "position/delete/" + id,
    );
  }

  exportPosition(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(API_CONFIG.BASE_URL + "position/export",
      pageable,
      {
        responseType: 'blob',
        observe: 'response',
        params: payload
      }
    );
  }

}
