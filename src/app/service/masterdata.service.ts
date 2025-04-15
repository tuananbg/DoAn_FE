import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {LoginService} from "./login.service";
import {API_CONFIG} from "../config/api-config";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  constructor(private httpClient: HttpClient,
              private login: LoginService) {
  }
  getListJobGroup(): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "mdm/list/jobGroup",
    )
  }
  getListPositionCategory(): Observable<any> {
    return this.httpClient.get(
      API_CONFIG.BASE_URL + "mdm/list/positionCategory",
    )
  }
}
