import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { _HttpClient } from '@delon/theme';
import {ToastService} from "./toast.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  env: any;

  constructor(
    private httpClient: _HttpClient,
    private http: HttpClient,
    private toastService: ToastService,
  ) {
    if (localStorage.getItem('env')) {
      this.env = localStorage.getItem('env');
    }
  }

  downloadFile(data?: any, fileName?: any) {
    if (!data || !data.body) {
      this.toastService.openErrorToast("Đã có lỗi trong quá trình xử lý, vui lòng thực hiện vào lúc khác.");
      return;
    }
    const link = document.createElement('a');
    const fileNameHeader = data.headers.get('File');
    const url = URL.createObjectURL(data.body);
    link.setAttribute('href', url);
    link.setAttribute('download', fileNameHeader !== null ? fileNameHeader : fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  uploadMultipleFile(files: any, type: any): Observable<any> {
    const fileData = new FormData();
    files.forEach((file: File) => {
      fileData.append('files', file);
    });

    return this.httpClient.post<any>(
      "http://localhost:8080/" + "dev/file/upload"+ '?type=' + type + '&_allow_anonymous=true',
      fileData, {observe: 'response'})
  }

  private getFile(id: any): Observable<any> {
    return this.http.get(
      "http://localhost:8080/" +"dev/file/" + id + '?_allow_anonymous=true', {
        responseType: 'blob',
        observe: 'response',
      })
  }

  async downloadFileById(id: any, fileName: any) {
    const dataFile = await this.getFile(id).toPromise();
    if (dataFile && dataFile.body.size > 0) {
      this.downloadFile(dataFile, fileName);
    } else {
      // this.toastService.openErrorToast(this.translateService.instant('common.import.error.file-not-found'));
    }
  }

  // ******** EDIT START *************
  private getFileByPath(path: any): Observable<any> {
    return this.http.get(
      "http://localhost:8080/" +"dev/file/downloadByPath" + '?filePath=' + path + '&_allow_anonymous=true', {
        responseType: 'blob',
        observe: 'response',
      })
  }

  async downloadFileByPath(path: any, fileName: any) {
    const dataFile = await this.getFileByPath(path).toPromise();
    if (dataFile && dataFile.body.size > 0) {
      this.downloadFile(dataFile, fileName);
    } else {
      // this.toastService.openErrorToast(this.translateService.instant('common.import.error.file-not-found'));
    }
  }
}
