import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {FileManagerService} from "../../../service/file-manager.service";
import {ToastService} from "../../../service/toast.service";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";

@Component({
  selector: 'app-upload-file-attachment',
  templateUrl: './upload-file-attachment.component.html',
  styleUrls: ['./upload-file-attachment.component.less']
})
export class UploadFileAttachmentComponent {

  fileList: NzUploadFile[] = [];
  @Input() uploading = false;
  uploadStatus: string | null = null;

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'uploading') {
      this.uploading = true;
    }
    if (info.file.status === 'done') {
      this.uploading = false;
      this.uploadStatus = 'Upload Success';
    } else if (info.file.status === 'error') {
      this.uploading = false;
      this.uploadStatus = 'Upload Failed';
    }
  }

}
