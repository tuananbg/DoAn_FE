import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListManagementComponent } from './task-list-management.component';

describe('TaskListManagementComponent', () => {
  let component: TaskListManagementComponent;
  let fixture: ComponentFixture<TaskListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
