import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormManagementComponent } from './task-form-management.component';

describe('TaskFormManagementComponent', () => {
  let component: TaskFormManagementComponent;
  let fixture: ComponentFixture<TaskFormManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskFormManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
