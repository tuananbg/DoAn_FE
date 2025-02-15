import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployeeManagermentComponent } from './detail-employee-managerment.component';

describe('DetailEmployeeManagermentComponent', () => {
  let component: DetailEmployeeManagermentComponent;
  let fixture: ComponentFixture<DetailEmployeeManagermentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEmployeeManagermentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEmployeeManagermentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
