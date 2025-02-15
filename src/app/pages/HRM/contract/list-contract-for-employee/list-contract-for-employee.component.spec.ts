import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContractForEmployeeComponent } from './list-contract-for-employee.component';

describe('ListContractForEmployeeComponent', () => {
  let component: ListContractForEmployeeComponent;
  let fixture: ComponentFixture<ListContractForEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListContractForEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContractForEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
