import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListGridComponent } from './task-list-grid.component';

describe('TaskListGridComponent', () => {
  let component: TaskListGridComponent;
  let fixture: ComponentFixture<TaskListGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
