import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeeManagermentComponent } from './list-employee-managerment.component';

describe('ListEmployeeManagermentComponent', () => {
  let component: ListEmployeeManagermentComponent;
  let fixture: ComponentFixture<ListEmployeeManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEmployeeManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
