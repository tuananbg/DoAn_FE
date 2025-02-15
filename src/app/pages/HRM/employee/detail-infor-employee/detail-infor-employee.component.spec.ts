import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInforEmployeeComponent } from './detail-infor-employee.component';

describe('DetailInforEmployeeComponent', () => {
  let component: DetailInforEmployeeComponent;
  let fixture: ComponentFixture<DetailInforEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailInforEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInforEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
