import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {DxDataGridComponent} from "devextreme-angular";
import {TaskForm, taskPriorityList, taskStatusList} from "../../../core/task";
import {Router} from "@angular/router";
import {DxTabsTypes} from "devextreme-angular/ui/tabs";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";

@Component({
  selector: 'app-task-list-grid',
  templateUrl: './task-list-grid.component.html',
  styleUrls: ['./task-list-grid.component.less']
})
export class TaskListGridComponent implements OnChanges {

  @ViewChild(DxDataGridComponent, { static: false }) grid!: DxDataGridComponent;

  @Input() dataSource!: TaskForm[];

  @Output() tabValueChanged: EventEmitter<any> = new EventEmitter<EventEmitter<any>>();

  tasks!: TaskForm[];

  priorityList = taskPriorityList;

  statusList = taskStatusList;

  isLoading = true;

  useNavigation = true;

  constructor(private router: Router) {
  }

  refresh() {
    this.grid.instance.refresh();
  }

  showColumnChooser() {
    this.grid.instance.showColumnChooser();
  }

  search(text: string) {
    this.grid.instance.searchByText(text);
  }

  // onExportingToPdf() {
  //   const doc = new jsPDF();
  //   exportToPdf({
  //     jsPDFDocument: doc,
  //     component: this.grid.instance,
  //   }).then(() => {
  //     doc.save('Tasks.pdf');
  //   });
  // };

  // onExportingToXLSX() {
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Tasks');
  //
  //   exportToXLSX({
  //     component: this.grid.instance,
  //     worksheet,
  //     autoFilterEnabled: true,
  //   }).then(() => {
  //     workbook.xlsx.writeBuffer().then((buffer) => {
  //       saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Tasks.xlsx');
  //     });
  //   });
  // };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      this.tasks = changes['dataSource'].currentValue.filter((item: any) => !!item.status && !!item.priority);
    }
  };

  toogleUseNavigation = () => {
    this.useNavigation = !this.useNavigation;
  };

  tabsItemClick = (e: DxTabsTypes.ItemClickEvent) => {
    this.tabValueChanged.emit(e);
  };

  navigateToDetails = (e: DxDataGridTypes.RowClickEvent) => {
    if(this.useNavigation && e.rowType !== 'detailAdaptive') {
      this.router.navigate(['/planning-task-details']);
    }
  };

}
