import {Component, Input, OnInit} from '@angular/core';
import {TaskForm, TaskPriority, TaskStatus} from "../../../core/task";
import {Router} from "@angular/router";
import notify from 'devextreme/ui/notify';
import {Activity} from "../../../core/activities";
import {Notes} from "../../../core/notes";
import {Messages} from "../../../core/messages";
@Component({
  selector: 'app-task-kanban-card',
  templateUrl: './task-kanban-card.component.html',
  styleUrls: ['./task-kanban-card.component.less']
})
export class TaskKanbanCardComponent implements  OnInit{

  @Input() task!: TaskForm;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  getAvatarText = (name: string) => name.split(' ').map((name) => name[0]).join('');

  onDetail(id: any){
    this.router.navigate(['/task/detail']);
  }

  navigateToDetails = (projectId: any, taskId: any) => {
    this.router.navigate(['/task/detail/', projectId,taskId]);
  };



}
