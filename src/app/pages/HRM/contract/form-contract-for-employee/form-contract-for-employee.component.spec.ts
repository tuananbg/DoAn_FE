import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContractForEmployeeComponent } from './form-contract-for-employee.component';

describe('FormContractForEmployeeComponent', () => {
  let component: FormContractForEmployeeComponent;
  let fixture: ComponentFixture<FormContractForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormContractForEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContractForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
