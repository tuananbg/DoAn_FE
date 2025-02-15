import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailManagementComponent } from './task-detail-management.component';

describe('TaskDetailManagementComponent', () => {
  let component: TaskDetailManagementComponent;
  let fixture: ComponentFixture<TaskDetailManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
