import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContractManagermentComponent } from './form-contract-managerment.component';

describe('FormContractManagermentComponent', () => {
  let component: FormContractManagermentComponent;
  let fixture: ComponentFixture<FormContractManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormContractManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContractManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
