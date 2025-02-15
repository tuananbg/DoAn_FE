import { Component, OnInit } from '@angular/core';
import DevExpress from "devextreme";
import DropZoneEnterEvent = DevExpress.ui.dxFileUploader.DropZoneEnterEvent;
import {DropZoneLeaveEvent} from "devextreme/ui/file_uploader";

@Component({
  selector: 'app-form-photo-uploader',
  templateUrl: './form-photo-uploader.component.html',
  styleUrls: ['./form-photo-uploader.component.less']
})
export class FormPhotoUploaderComponent {

  isDropZoneActive = false;

  onDropZoneEnter(e: DropZoneEnterEvent) {
    if (e.dropZoneElement.id === 'uploader') { this.isDropZoneActive = true; }
  }

  onDropZoneLeave(e: DropZoneLeaveEvent) {
    if (e.dropZoneElement.id === 'uploader') { this.isDropZoneActive = false; }
  }

  onValueChanged(e: any) {
    const files: File[] = e.value; // Lấy danh sách các tệp đã chọn
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i]; // Lấy tệp thứ i trong danh sách
        console.log('File name:', file.name); // In ra tên của tệp
        console.log('File size:', file.size); // In ra kích thước của tệp (byte)
        console.log('File type:', file.type); // In ra loại của tệp (ví dụ: image/jpeg)
      }
    }
  }
}
