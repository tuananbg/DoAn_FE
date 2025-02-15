import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/socialinsurance";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class SocialinsuranceService {

  constructor(private httpClient: HttpClient) {
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
