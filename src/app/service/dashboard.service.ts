import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/dashboard";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) {
  }

  getStaticticalDepartment(): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/statisticalDepartment/",
    );
  }

  getStaticticalHeader(id: any): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/statisticalHeader/"+id,
    );
  }

  getStaticticalContract(): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/statisticalContract/",
    );
  }

  getStatisticalTask(): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/statisticalTask/",
    );
  }
  // search(payload: any, pageable: any): Observable<any> {
  //   return this.httpClient.post(
  //     AUTH_API + "/search",
  //     payload,
  //     {
  //       headers: new HttpHeaders({'Content-Type': 'application/json'}),
  //       params: pageable,
  //     }
  //   )
  // }
  //
  // searchForEmployee(payload: any, pageable: any): Observable<any> {
  //   return this.httpClient.post(
  //     AUTH_API + "/searchForEmployee",
  //     payload,
  //     {
  //       headers: new HttpHeaders({'Content-Type': 'application/json'}),
  //       params: pageable,
  //     }
  //   )
  // }
  //
  // create(file: File, contractDTO: any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('contractCode', contractDTO.contractCode);
  //   formData.append('contractType', contractDTO.contractType);
  //   return this.httpClient.post(
  //     AUTH_API + "/create",
  //     formData,
  //     {
  //       observe: 'response'
  //     }
  //   );
  // }
  //
  // createForEmployee(userDetailContractDTO: any): Observable<any> {
  //   return this.httpClient.post(AUTH_API + "/createForEmployee",
  //     userDetailContractDTO,
  //     {
  //       observe: 'response'
  //     })
  // }
  //
  // getContractId(id: number | undefined): Observable<any> {
  //   return this.httpClient.get(
  //     AUTH_API + "/detail" + '/' + id,
  //   );
  // }
  //
  // edit(file: File, contractDTO: any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('contractId', contractDTO.contractId);
  //   formData.append('contractCode', contractDTO.contractCode);
  //   formData.append('contractType', contractDTO.contractType);
  //   return this.httpClient.put(
  //     AUTH_API,
  //     formData,
  //     {
  //       observe: 'response'
  //     }
  //   );
  // }
  //
  // editForEmployee(payload: any): Observable<any> {
  //   return this.httpClient.put(
  //     AUTH_API+ "/updateForEmployee",
  //     payload
  //   );
  // }
  //
  // delete(id: string): Observable<any> {
  //   return this.httpClient.delete(
  //     AUTH_API + "/delete" + '/' + id,
  //   );
  // }
  //
  // deleteForEmployee(id: string): Observable<any> {
  //   return this.httpClient.delete(
  //     AUTH_API + "/deleteForEmployee" + '/' + id,
  //   );
  // }
  //
  // downLoadFile(fileName: any): Observable<any> {
  //   const params = new HttpParams().set('fileName', fileName);
  //   return this.httpClient.post(AUTH_API + "/download", null, {
  //     responseType: 'blob',
  //     observe: 'response',
  //     params: params
  //   });
  // }
}
