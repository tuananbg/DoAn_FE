import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBoardManagementComponent } from './task-board-management.component';

describe('TaskBoardManagementComponent', () => {
  let component: TaskBoardManagementComponent;
  let fixture: ComponentFixture<TaskBoardManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskBoardManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskBoardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
