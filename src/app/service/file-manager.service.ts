import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {_HttpClient} from '@delon/theme';
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

  /**
   * Xử lý download file từ response blob, parse filename từ header nếu có
   */
  async downloadBlobResponse(response: any, fallbackFileName = 'export.xlsx') {
    const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
    const blob = response.body;

    if (isJsonBlob(blob)) {
      const text = await blob.text();
      const errorData = JSON.parse(text);
      throw { msgCode: errorData.msgCode || 'Không có dữ liệu phù hợp để tải xuống.' };
    }

    let fileName = fallbackFileName;
    const contentDisposition = response.headers.get('Content-Disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]);
      }
    }

    this.downloadFile(response, fileName); // fileManagerService.downloadFile()
  }




}
