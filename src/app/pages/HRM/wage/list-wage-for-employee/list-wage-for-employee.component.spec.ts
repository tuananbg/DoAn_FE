import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWageForEmployeeComponent } from './list-wage-for-employee.component';

describe('ListWageForEmployeeComponent', () => {
  let component: ListWageForEmployeeComponent;
  let fixture: ComponentFixture<ListWageForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWageForEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWageForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
