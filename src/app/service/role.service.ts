import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {API_CONFIG} from "../config/api-config";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private httpClient: HttpClient) {
  }
  selectRole(): Observable<any> {
    return this.httpClient.get(
      `${API_CONFIG.BASE_URL}role/select`,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }
}
