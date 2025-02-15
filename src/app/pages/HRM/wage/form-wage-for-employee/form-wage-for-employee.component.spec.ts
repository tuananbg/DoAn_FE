import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWageForEmployeeComponent } from './form-wage-for-employee.component';

describe('FormWageForEmployeeComponent', () => {
  let component: FormWageForEmployeeComponent;
  let fixture: ComponentFixture<FormWageForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormWageForEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWageForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
